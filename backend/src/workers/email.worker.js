"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailWorker = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
const prisma_1 = __importDefault(require("../config/prisma"));
const email_service_1 = require("../services/email.service");
exports.emailWorker = new bullmq_1.Worker("email-queue", async (job) => {
    console.log("📧 Processing Email Job");
    const { scheduledEmailId, senderId, email, subject, body, } = job.data;
    await prisma_1.default.scheduledEmail.update({
        where: {
            id: scheduledEmailId,
        },
        data: {
            status: "PROCESSING",
        },
    });
    const sender = await prisma_1.default.sender.findUnique({
        where: {
            id: senderId,
        },
    });
    if (!sender) {
        throw new Error("Sender not found");
    }
    if (job?.data?.leadId) {
        await prisma_1.default.lead.update({
            where: {
                id: job.data.leadId,
            },
            data: {
                status: "PROCESSING",
            },
        });
    }
    await (0, email_service_1.sendEmail)(sender.smtpHost, sender.smtpPort, sender.smtpUser, sender.smtpPassword, sender.smtpEmail, email, subject, body);
    if (job?.data?.leadId) {
        await prisma_1.default.lead.update({
            where: {
                id: job.data.leadId,
            },
            data: {
                status: "SENT",
            },
        });
    }
    await prisma_1.default.scheduledEmail.update({
        where: {
            id: scheduledEmailId,
        },
        data: {
            status: "SENT",
            sentAt: new Date(),
        },
    });
    console.log(`Email sent to ${email}`);
    return {
        success: true,
    };
}, {
    connection: redis_1.redisConnection,
});
exports.emailWorker.on("completed", (job) => {
    console.log(`✅ Job ${job.id} completed`);
});
exports.emailWorker.on("failed", async (job, err) => {
    console.error(`❌ Job ${job?.id} failed`, err);
    if (job?.data?.leadId) {
        await prisma_1.default.lead.update({
            where: {
                id: job.data.leadId,
            },
            data: {
                status: "FAILED",
            },
        });
    }
});
//# sourceMappingURL=email.worker.js.map