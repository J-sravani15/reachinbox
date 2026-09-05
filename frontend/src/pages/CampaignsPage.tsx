import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { CampaignTable } from "../components/campaigns/CampaignTable";
import { Button } from "../components/ui/Button";
import { ErrorBanner } from "../components/ui/ErrorBanner";
import { useCampaigns } from "../hooks/useCampaigns";
import { getErrorMessage } from "../services/api";
import { deleteCampaign, startCampaign } from "../services/campaigns";
import type { Campaign } from "../types";

export function CampaignsPage() {
  const navigate = useNavigate();
  const { campaigns, loading, error, reload } = useCampaigns();
  const [busyId, setBusyId] = useState<string | null>(null);

  const handleStart = async (campaign: Campaign) => {
    const confirmed = window.confirm(
      `Start campaign "${campaign.subject}"? Emails will be queued for all linked leads.`
    );

    if (!confirmed) {
      return;
    }

    setBusyId(campaign.id);
    try {
      const result = await startCampaign(campaign.id);
      toast.success(
        `Campaign started — ${result.queued} email${result.queued === 1 ? "" : "s"} queued.`
      );
      await reload();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (campaign: Campaign) => {
    const confirmed = window.confirm(
      `Delete campaign "${campaign.subject}"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setBusyId(campaign.id);
    try {
      await deleteCampaign(campaign.id);
      toast.success("Campaign deleted.");
      await reload();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const handleView = (campaign: Campaign) => {
    navigate(`/campaigns/${campaign.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Campaigns</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Manage your outreach campaigns and their sending schedules.
          </p>
        </div>
        <Link to="/campaigns/create">
          <Button icon={<Plus className="size-4" aria-hidden="true" />}>
            New Campaign
          </Button>
        </Link>
      </div>

      {error && <ErrorBanner message={error} onRetry={() => void reload()} />}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <CampaignTable
          campaigns={campaigns}
          loading={loading}
          busyId={busyId}
          onStart={(campaign) => void handleStart(campaign)}
          onView={handleView}
          onDelete={(campaign) => void handleDelete(campaign)}
        />
      </div>
    </div>
  );
}