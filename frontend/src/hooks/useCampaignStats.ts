import { useCallback, useEffect, useState } from "react";

import { getErrorMessage } from "../services/api";
import { getCampaignStats } from "../services/campaigns";
import type { CampaignStats } from "../types";

interface UseCampaignStatsResult {
  stats: CampaignStats | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

export function useCampaignStats(
  campaignId: string | undefined
): UseCampaignStatsResult {
  const [stats, setStats] = useState<CampaignStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!campaignId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getCampaignStats(campaignId);
      setStats(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { stats, loading, error, reload };
}