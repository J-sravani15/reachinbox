import { Request, Response } from "express";
import prisma from "../config/prisma";

export const createSender = async (req: Request, res: Response) => {
  console.log("BODY RECEIVED:", req.body);
  try {
    const {
      userId,
      name,
      smtpEmail,
      smtpHost,
      smtpPort,
      smtpUser,
      smtpPassword,
    } = req.body;

    const sender = await prisma.sender.create({
      data: {
        userId,
        name,
        smtpEmail,
        smtpHost,
        smtpPort,
        smtpUser,
        smtpPassword,
      },
    });

    return res.status(201).json(sender);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to create sender",
    });
  }
};

export const getSenders = async (req, res) => {
  const senders = await prisma.sender.findMany();

  console.log(senders);

  return res.json(senders);
};

export const deleteSender = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.sender.delete({
      where: {
        id,
      },
    });

    return res.json({
      message: "Sender deleted",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to delete sender",
    });
  }
};