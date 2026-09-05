import { Worker } from "bullmq";
import { redisConnection } from "../config/redis";
import prisma from "../config/prisma";
import { sendEmail } from "../services/email.service";

export const emailWorker = new Worker(
  "email-queue",
  async (job) => {
    console.log("📧 Processing Email Job");

    const {
  scheduledEmailId,
  senderId,
  email,
  subject,
  body,
} = job.data;
await prisma.scheduledEmail.update({
  where: {
    id: scheduledEmailId,
  },
  data: {
    status: "PROCESSING",
  },
});

    const sender = await prisma.sender.findUnique({
      where: {
        id: senderId,
      },
    });

    if (!sender) {
      throw new Error("Sender not found");
    } 
    if (job?.data?.leadId) {
  await prisma.lead.update({
    where: {
      id: job.data.leadId,
    },
    data: {
      status: "PROCESSING",
    },
  });
}

   await sendEmail(
  sender.smtpHost,
  sender.smtpPort,
  sender.smtpUser,
  sender.smtpPassword,
  sender.smtpEmail,
  email,
  subject,
  body
);
if (job?.data?.leadId) {
  await prisma.lead.update({
    where: {
      id: job.data.leadId,
    },
    data: {
      status: "SENT",
    },
  });
}
await prisma.scheduledEmail.update({
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
  },
  {
    connection: redisConnection,
  }
);

emailWorker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

emailWorker.on("failed", async (job, err) => {
  console.error(`❌ Job ${job?.id} failed`, err);

  if (job?.data?.leadId) {
    await prisma.lead.update({
      where: {
        id: job.data.leadId,
      },
      data: {
        status: "FAILED",
      },
    });
  }
});