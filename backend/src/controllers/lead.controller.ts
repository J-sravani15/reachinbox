import { Request, Response } from "express";
import prisma from "../config/prisma";

export const createLead = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      campaignId,
      email,
      firstName,
      company,
    } = req.body;

    const lead = await prisma.lead.create({
      data: {
        campaignId,
        email,
        firstName,
        company,
      },
    });

    return res.status(201).json(lead);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to create lead",
    });
  }
};

export const getLeads = async (
  req: Request,
  res: Response
) => {
  try {
    const leads = await prisma.lead.findMany();

    return res.json(leads);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch leads",
    });
  }
};