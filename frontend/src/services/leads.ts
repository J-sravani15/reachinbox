import type { CreateLeadPayload, Lead } from "../types";
import { api } from "./api";

export async function getLeads(): Promise<Lead[]> {
  const { data } = await api.get<Lead[]>("/leads");
  return data;
}

export async function createLead(payload: CreateLeadPayload): Promise<Lead> {
  const { data } = await api.post<Lead>("/leads", payload);
  return data;
}