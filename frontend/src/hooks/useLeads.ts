import { useCallback, useEffect, useState } from "react";

import { getErrorMessage } from "../services/api";
import { getLeads } from "../services/leads";
import type { Lead } from "../types";

interface UseLeadsResult {
  leads: Lead[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

export function useLeads(): UseLeadsResult {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getLeads();
      setLeads(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { leads, loading, error, reload };
}