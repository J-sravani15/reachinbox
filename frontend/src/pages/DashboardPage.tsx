import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Clock,
  Mail,
  Send,
  Users,
} from "lucide-react";

import { CampaignStatusBadge } from "../components/ui/Badge";
import { ErrorBanner } from "../components/ui/ErrorBanner";
import { Loader } from "../components/ui/Loader";
import { StatCard } from "../components/ui/StatCard";
import { useCampaigns } from "../hooks/useCampaigns";
import { useLeads } from "../hooks/useLeads";
import { formatDate } from "../lib/format";
import { getCampaignStats } from "../services/campaigns";
import { getErrorMessage } from "../services/api";
import type { CampaignStats } from "../types";

export function DashboardPage() {
  const { campaigns, loading: campaignsLoading, error: campaignsError, reload: reloadCampaigns } = useCampaigns();
  const { leads, loading: leadsLoading, error: leadsError, reload: reloadLeads } = useLeads();
  const [emailAggregates, setEmailAggregates] = useState<{
    sent: number;
    pending: number;
  } | null>(null);
  const [aggregatesError, setAggregatesError] = useState<string | null>(null);

  useEffect(() => {
    if (campaigns.length === 0) {
      setEmailAggregates({ sent: 0, pending: 0 });
      return;
    }

    let cancelled = false;

    (async () => {
      setAggregatesError(null);
      const results = await Promise.allSettled(
        campaigns.map((campaign) => getCampaignStats(campaign.id))
      );

      if (cancelled) {
        return;
      }

      if (results.some((result) => result.status === "fulfilled")) {
        const fulfilled = results
          .filter(
            (result): result is PromiseFulfilledResult<CampaignStats> =>
              result.status === "fulfilled"
          )
          .map((result) => result.value);

        setEmailAggregates({
          sent: fulfilled.reduce((sum, stats) => sum + stats.sent, 0),
          pending: fulfilled.reduce((sum, stats) => sum + stats.pending, 0),
        });
      } else {
        setEmailAggregates({ sent: 0, pending: 0 });
        setAggregatesError(
          getErrorMessage(
            results[0]?.status === "rejected" ? results[0].reason : null
          )
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [campaigns]);

  const loading = campaignsLoading || leadsLoading;
  const loadError = campaignsError ?? leadsError;

  const recentCampaigns = useMemo(
    () =>
      campaigns
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5),
    [campaigns]
  );

  if (loading) {
    return <Loader label="Loading dashboard…" />;
  }

  return (
    <div className="space-y-6">
      {loadError && (
        <ErrorBanner
          message={loadError}
          onRetry={() => {
            void reloadCampaigns();
            void reloadLeads();
          }}
        />
      )}
      {aggregatesError && (
        <ErrorBanner
          message={aggregatesError}
          onRetry={() => setEmailAggregates(null)}
        />
      )}

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
          Overview
        </h2>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Campaigns"
            value={campaigns.length}
            icon={Send}
            tone="indigo"
            hint="Active outreach programs"
          />
          <StatCard
            label="Total Leads"
            value={leads.length}
            icon={Users}
            tone="emerald"
            hint="Contacts across campaigns"
          />
          <StatCard
            label="Total Sent Emails"
            value={emailAggregates?.sent ?? 0}
            icon={Mail}
            tone="sky"
            hint="Delivered messages"
          />
          <StatCard
            label="Total Pending Emails"
            value={emailAggregates?.pending ?? 0}
            icon={Clock}
            tone="amber"
            hint="Scheduled & in progress"
          />
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Recent Campaigns
          </h2>
          <Link
            to="/campaigns"
            className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            View all
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {recentCampaigns.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-slate-500">
              <p className="font-semibold text-slate-700">No campaigns yet</p>
              <p className="mt-1">
                Create your first campaign to get started with outreach.
              </p>
              <Link
                to="/campaigns/create"
                className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Create a campaign
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentCampaigns.map((campaign) => (
                <li key={campaign.id}>
                  <Link
                    to={`/campaigns/${campaign.id}`}
                    className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-slate-50"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                        <Send className="size-4" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-slate-900">
                          {campaign.subject}
                        </p>
                        <p className="text-xs text-slate-500">
                          Created {formatDate(campaign.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <CampaignStatusBadge status={campaign.status} />
                      <ArrowRight
                        className="size-4 text-slate-400"
                        aria-hidden="true"
                      />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}