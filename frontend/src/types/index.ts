export type CampaignStatus = "ACTIVE" | "COMPLETED" | "PAUSED";

export interface Campaign {
  id: string;
  userId: string;
  subject: string;
  body: string;
  startTime: string;
  delayBetweenEmails: number;
  hourlyLimit: number;
  status: CampaignStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  campaignId: string;
  email: string;
  firstName: string | null;
  company: string | null;
  status: string;
  createdAt: string;
}

export interface CampaignStats {
  total: number;
  sent: number;
  failed: number;
  pending: number;
}

export interface StartCampaignResponse {
  success: boolean;
  queued: number;
}

export interface CreateCampaignPayload {
  userId: string;
  subject: string;
  body: string;
  startTime: string;
  delayBetweenEmails: number;
  hourlyLimit: number;
}

export interface CreateLeadPayload {
  campaignId: string;
  email: string;
  firstName: string;
  company: string;
}

export interface CampaignFormValues {
  subject: string;
  body: string;
  delayBetweenEmails: string;
  hourlyLimit: string;
}

export interface LeadFormValues {
  campaignId: string;
  email: string;
  firstName: string;
  company: string;
}