import { Request, Response } from "express";
import prisma from "../config/prisma";

export const createScheduledEmail = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      campaignId,
      senderId,
      recipientEmail,
      scheduledAt,
    } = req.body;

    const email = await prisma.scheduledEmail.create({
      data: {
        campaignId,
        senderId,
        recipientEmail,
        scheduledAt: new Date(scheduledAt),
      },
    });

    return res.status(201).json(email);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to create email",
    });
  }
};

export const getScheduledEmails = async (
  req: Request,
  res: Response
) => {
  try {
    const emails = await prisma.scheduledEmail.findMany();

    return res.json(emails);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch emails",
    });
  }
};