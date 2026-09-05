"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCampaignStats = exports.startCampaign = exports.deleteCampaign = exports.getCampaigns = exports.createCampaign = void 0;
const email_queue_1 = require("../queues/email.queue");
const prisma_1 = __importDefault(require("../config/prisma"));
const createCampaign = async (req, res) => {
    try {
        const { userId, subject, body, startTime, delayBetweenEmails, hourlyLimit, } = req.body;
        const campaign = await prisma_1.default.campaign.create({
            data: {
                userId,
                subject,
                body,
                startTime: new Date(startTime),
                delayBetweenEmails,
                hourlyLimit,
            },
        });
        return res.status(201).json(campaign);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to create campaign",
        });
    }
};
exports.createCampaign = createCampaign;
const getCampaigns = async (req, res) => {
    try {
        const campaigns = await prisma_1.default.campaign.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        return res.json(campaigns);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to fetch campaigns",
        });
    }
};
exports.getCampaigns = getCampaigns;
const deleteCampaign = async (req, res) => {
    try {
        const id = req.params.id;
        await prisma_1.default.campaign.delete({
            where: {
                id,
            },
        });
        return res.json({
            message: "Campaign deleted",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to delete campaign",
        });
    }
};
exports.deleteCampaign = deleteCampaign;
const startCampaign = async (req, res) => {
    try {
        const id = req.params.id;
        const campaign = await prisma_1.default.campaign.findUnique({
            where: {
                id,
            },
        });
        if (!campaign) {
            return res.status(404).json({
                message: "Campaign not found",
            });
        }
        const leads = await prisma_1.default.lead.findMany({
            where: {
                campaignId: id,
            },
        });
        for (const [i, lead] of leads.entries()) {
            const lead = leads[i];
            const scheduledTime = new Date(Date.now() + i * campaign.delayBetweenEmails * 1000);
            const scheduledEmail = await prisma_1.default.scheduledEmail.create({
                data: {
                    campaignId: campaign.id,
                    senderId: "3bd1aa4a-33fb-47c0-86bb-211197b95ba1",
                    recipientEmail: lead.email,
                    scheduledAt: scheduledTime,
                },
            });
            await email_queue_1.emailQueue.add("send-email", {
                scheduledEmailId: scheduledEmail.id,
                campaignId: campaign.id,
                leadId: lead.id,
                email: lead.email,
                senderId: "3bd1aa4a-33fb-47c0-86bb-211197b95ba1",
                subject: campaign.subject,
                body: campaign.body.replace("{{firstName}}", lead.firstName || "Friend"),
            }, {
                delay: i * campaign.delayBetweenEmails * 1000,
            });
        }
        return res.json({
            success: true,
            queued: leads.length,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to start campaign",
        });
    }
};
exports.startCampaign = startCampaign;
const getCampaignStats = async (req, res) => {
    try {
        const id = req.params.id;
        const total = await prisma_1.default.scheduledEmail.count({
            where: {
                campaignId: id,
            },
        });
        const sent = await prisma_1.default.scheduledEmail.count({
            where: {
                campaignId: id,
                status: "SENT",
            },
        });
        const failed = await prisma_1.default.scheduledEmail.count({
            where: {
                campaignId: id,
                status: "FAILED",
            },
        });
        const pending = await prisma_1.default.scheduledEmail.count({
            where: {
                campaignId: id,
                status: {
                    in: ["SCHEDULED", "PROCESSING"],
                },
            },
        });
        return res.json({
            total,
            sent,
            failed,
            pending,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to fetch stats",
        });
    }
};
exports.getCampaignStats = getCampaignStats;
//# sourceMappingURL=campaign.controller.js.map