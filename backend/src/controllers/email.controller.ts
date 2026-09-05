import { emailQueue } from "../queues/email.queue";
import { Request, Response } from "express";
import prisma from "../config/prisma";
import { sendEmail } from "../services/email.service";

export const sendTestEmail = async (
  req: Request,
  res: Response
) => {
  try {
    const { senderId, recipient } = req.body;

    const sender = await prisma.sender.findUnique({
      where: {
        id: senderId,
      },
    });

    if (!sender) {
      return res.status(404).json({
        message: "Sender not found",
      });
    }

    await sendEmail(
      sender.smtpHost,
      sender.smtpPort,
      sender.smtpUser,
      sender.smtpPassword,
      sender.smtpEmail,
      recipient,
      "ReachInbox Test",
      "<h1>Hello from ReachInbox</h1>"
    );

    return res.json({
      message: "Email sent",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to send email",
    });
  }
};

export const queueTestEmail = async (
  req: Request,
  res: Response
) => {
  try {
    const { senderId, recipient } = req.body;

    const job = await emailQueue.add("send-email", {
      senderId,
      recipient,
      subject: "BullMQ Test Email",
      html: "<h1>Hello from BullMQ Worker</h1>",
    });

    return res.json({
      success: true,
      jobId: job.id,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to add job",
    });
  }
};