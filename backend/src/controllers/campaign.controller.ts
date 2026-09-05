import { Request, Response } from "express";
import { emailQueue } from "../queues/email.queue";
import prisma from "../config/prisma";

export const createCampaign = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      userId,
      subject,
      body,
      startTime,
      delayBetweenEmails,
      hourlyLimit,
    } = req.body;

    const campaign = await prisma.campaign.create({
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
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to create campaign",
    });
  }
};
export const getCampaigns = async (
  req: Request,
  res: Response
) => {
  try {
    const campaigns = await prisma.campaign.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(campaigns);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch campaigns",
    });
  }
};

export const deleteCampaign = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id as string;

    await prisma.campaign.delete({
      where: {
        id,
      },
    });

    return res.json({
      message: "Campaign deleted",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to delete campaign",
    });
  }
};
export const startCampaign = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id as string;

    const campaign = await prisma.campaign.findUnique({
      where: {
        id,
      },
    });

    if (!campaign) {
      return res.status(404).json({
        message: "Campaign not found",
      });
    }

    const leads = await prisma.lead.findMany({
      where: {
        campaignId: id,
      },
    });

    for (const [i, lead] of leads.entries()) {
  const lead = leads[i];

  const scheduledTime = new Date(
    Date.now() + i * campaign.delayBetweenEmails * 1000
  );

  const scheduledEmail = await prisma.scheduledEmail.create({
    data: {
      campaignId: campaign.id,
      senderId: "3bd1aa4a-33fb-47c0-86bb-211197b95ba1",
      recipientEmail: lead.email,
      scheduledAt: scheduledTime,
    },
  });

  await emailQueue.add(
    "send-email",
    {
      scheduledEmailId: scheduledEmail.id,
      campaignId: campaign.id,
      leadId: lead.id,
      email: lead.email,
      senderId: "3bd1aa4a-33fb-47c0-86bb-211197b95ba1",
      subject: campaign.subject,
      body: campaign.body.replace(
  "{{firstName}}",
  lead.firstName || "Friend"
),
    },
    {
      delay: i * campaign.delayBetweenEmails * 1000,
    }
  );
}

    return res.json({
      success: true,
      queued: leads.length,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to start campaign",
    });
  }
};

export const getCampaignStats = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id as string;

    const total = await prisma.scheduledEmail.count({
      where: {
        campaignId: id,
      },
    });

    const sent = await prisma.scheduledEmail.count({
      where: {
        campaignId: id,
        status: "SENT",
      },
    });

    const failed = await prisma.scheduledEmail.count({
      where: {
        campaignId: id,
        status: "FAILED",
      },
    });

    const pending = await prisma.scheduledEmail.count({
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
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch stats",
    });
  }
};