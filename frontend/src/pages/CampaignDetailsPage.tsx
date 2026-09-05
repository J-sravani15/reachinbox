import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Mail,
  Play,
  Send,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { CampaignStatusBadge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { ErrorBanner } from "../components/ui/ErrorBanner";
import { Loader } from "../components/ui/Loader";
import { StatCard } from "../components/ui/StatCard";
import { useCampaignStats } from "../hooks/useCampaignStats";
import { cn } from "../lib/cn";
import { formatDateTime } from "../lib/format";
import { getErrorMessage } from "../services/api";
import { getCampaign, startCampaign } from "../services/campaigns";
import type { Campaign } from "../types";

export function CampaignDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { stats, loading: statsLoading, error: statsError, reload: reloadStats } =
    useCampaignStats(id);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [campaignLoading, setCampaignLoading] = useState(true);
  const [campaignError, setCampaignError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  const loadCampaign = useCallback(async () => {
    if (!id) {
      return;
    }

    setCampaignLoading(true);
    setCampaignError(null);

    try {
      const result = await getCampaign(id);
      setCampaign(result);
    } catch (err) {
      setCampaignError(getErrorMessage(err));
    } finally {
      setCampaignLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadCampaign();
  }, [loadCampaign]);

  const handleStart = async () => {
    if (!id || !campaign) {
      return;
    }

    const confirmed = window.confirm(
      `Start campaign "${campaign.subject}" now?`
    );

    if (!confirmed) {
      return;
    }

    setStarting(true);

    try {
      const result = await startCampaign(id);
      toast.success(
        `Campaign started — ${result.queued} email${result.queued === 1 ? "" : "s"} queued.`
      );
      await reloadStats();
      await loadCampaign();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setStarting(false);
    }
  };

  if (campaignLoading) {
    return <Loader label="Loading campaign…" />;
  }

  if (campaignError) {
    return (
      <ErrorBanner
        message={campaignError}
        onRetry={() => void loadCampaign()}
      />
    );
  }

  if (!campaign) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <Send className="mx-auto size-10 text-slate-300" aria-hidden="true" />
        <h2 className="mt-4 text-lg font-bold text-slate-900">
          Campaign not found
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          This campaign may have been deleted or the link is incorrect.
        </p>
        <Link to="/campaigns" className="mt-5 inline-block">
          <Button variant="secondary">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to campaigns
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/campaigns"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to campaigns
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h2 className="text-xl font-bold text-slate-900">
            {campaign.subject}
          </h2>
          <CampaignStatusBadge status={campaign.status} />
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Created {formatDateTime(campaign.createdAt)} ·{" "}
          {campaign.delayBetweenEmails}s between emails ·{" "}
          {campaign.hourlyLimit.toLocaleString()} per hour
        </p>
      </div>

      {statsError && (
        <ErrorBanner message={statsError} onRetry={() => void reloadStats()} />
      )}

      {statsLoading ? (
        <Loader label="Loading statistics…" />
      ) : (
        stats && (
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Email Statistics
            </h3>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Total Emails"
                value={stats.total}
                icon={Mail}
                tone="indigo"
                hint="All scheduled emails"
              />
              <StatCard
                label="Sent"
                value={stats.sent}
                icon={CheckCircle2}
                tone="emerald"
                hint="Delivered successfully"
              />
              <StatCard
                label="Failed"
                value={stats.failed}
                icon={XCircle}
                tone="rose"
                hint="Permanent failures"
              />
              <StatCard
                label="Pending"
                value={stats.pending}
                icon={Clock}
                tone="amber"
                hint="Scheduled & processing"
              />
            </div>
          </section>
        )
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-slate-900">Run this campaign</h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Queues emails for every lead attached to this campaign.
            </p>
          </div>
          <Button loading={starting} onClick={() => void handleStart()}>
            {!starting && <Play className="size-4" aria-hidden="true" />}
            {starting ? "Starting…" : "Start Campaign"}
          </Button>
        </div>

        {campaign.body && (
          <div
            className={cn(
              "mt-6 whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-600"
            )}
          >
            {campaign.body}
          </div>
        )}
      </div>
    </div>
  );
}