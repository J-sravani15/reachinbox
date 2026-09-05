"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScheduledEmails = exports.createScheduledEmail = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const createScheduledEmail = async (req, res) => {
    try {
        const { campaignId, senderId, recipientEmail, scheduledAt, } = req.body;
        const email = await prisma_1.default.scheduledEmail.create({
            data: {
                campaignId,
                senderId,
                recipientEmail,
                scheduledAt: new Date(scheduledAt),
            },
        });
        return res.status(201).json(email);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to create email",
        });
    }
};
exports.createScheduledEmail = createScheduledEmail;
const getScheduledEmails = async (req, res) => {
    try {
        const emails = await prisma_1.default.scheduledEmail.findMany();
        return res.json(emails);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to fetch emails",
        });
    }
};
exports.getScheduledEmails = getScheduledEmails;
//# sourceMappingURL=scheduled-email.controller.js.map