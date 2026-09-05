"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queueTestEmail = exports.sendTestEmail = void 0;
const email_queue_1 = require("../queues/email.queue");
const prisma_1 = __importDefault(require("../config/prisma"));
const email_service_1 = require("../services/email.service");
const sendTestEmail = async (req, res) => {
    try {
        const { senderId, recipient } = req.body;
        const sender = await prisma_1.default.sender.findUnique({
            where: {
                id: senderId,
            },
        });
        if (!sender) {
            return res.status(404).json({
                message: "Sender not found",
            });
        }
        await (0, email_service_1.sendEmail)(sender.smtpHost, sender.smtpPort, sender.smtpUser, sender.smtpPassword, sender.smtpEmail, recipient, "ReachInbox Test", "<h1>Hello from ReachInbox</h1>");
        return res.json({
            message: "Email sent",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to send email",
        });
    }
};
exports.sendTestEmail = sendTestEmail;
const queueTestEmail = async (req, res) => {
    try {
        const { senderId, recipient } = req.body;
        const job = await email_queue_1.emailQueue.add("send-email", {
            senderId,
            recipient,
            subject: "BullMQ Test Email",
            html: "<h1>Hello from BullMQ Worker</h1>",
        });
        return res.json({
            success: true,
            jobId: job.id,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to add job",
        });
    }
};
exports.queueTestEmail = queueTestEmail;
//# sourceMappingURL=email.controller.js.map