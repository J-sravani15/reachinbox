import { DEFAULT_USER_ID } from "../lib/config";
import type {
  Campaign,
  CampaignStats,
  CreateCampaignPayload,
  StartCampaignResponse,
} from "../types";
import { api } from "./api";

export async function getCampaigns(): Promise<Campaign[]> {
  const { data } = await api.get<Campaign[]>("/campaigns");
  return data;
}

export async function createCampaign(
  payload: CreateCampaignPayload
): Promise<Campaign> {
  const { data } = await api.post<Campaign>("/campaigns", payload);
  return data;
}

export async function deleteCampaign(id: string): Promise<void> {
  await api.delete(`/campaigns/${id}`);
}

export async function startCampaign(
  id: string
): Promise<StartCampaignResponse> {
  const { data } = await api.post<StartCampaignResponse>(
    `/campaigns/${id}/start`
  );
  return data;
}

export async function getCampaignStats(
  id: string
): Promise<CampaignStats> {
  const { data } = await api.get<CampaignStats>(`/campaigns/${id}/stats`);
  return data;
}

export async function getCampaign(id: string): Promise<Campaign | null> {
  const campaigns = await getCampaigns();
  return campaigns.find((campaign) => campaign.id === id) ?? null;
}

/**
 * Resolves the userId used when creating campaigns. The backend requires a
 * userId that references an existing row in the `users` table but exposes no
 * endpoint to list users, so the app prefers the configured VITE_USER_ID and
 * falls back to the userId of the most recent campaign already in the system.
 */
export async function resolveUserId(): Promise<string> {
  if (DEFAULT_USER_ID) {
    return DEFAULT_USER_ID;
  }

  const campaigns = await getCampaigns();

  if (campaigns.length > 0 && campaigns[0].userId) {
    return campaigns[0].userId;
  }

  throw new Error(
    "No VITE_USER_ID is configured and there is no existing campaign to infer a user from. Set VITE_USER_ID in the .env file to a user id from your database."
  );
}