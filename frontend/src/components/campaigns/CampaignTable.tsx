import { Eye, Play, Send, Trash2 } from "lucide-react";

import { formatDate, formatDuration, formatNumber } from "../../lib/format";
import type { Campaign } from "../../types";
import { Button } from "../ui/Button";
import { CampaignStatusBadge } from "../ui/Badge";
import { EmptyState } from "../ui/EmptyState";

interface CampaignTableProps {
  campaigns: Campaign[];
  loading: boolean;
  busyId: string | null;
  onStart: (campaign: Campaign) => void;
  onView: (campaign: Campaign) => void;
  onDelete: (campaign: Campaign) => void;
}

export function CampaignTable({
  campaigns,
  loading,
  busyId,
  onStart,
  onView,
  onDelete,
}: CampaignTableProps) {
  if (!loading && campaigns.length === 0) {
    return (
      <EmptyState
        icon={Send}
        title="No campaigns yet"
        description="Create your first campaign to start sending outreach emails."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
            <th className="px-6 py-3.5 font-semibold">Subject</th>
            <th className="px-6 py-3.5 font-semibold">Status</th>
            <th className="px-6 py-3.5 font-semibold">Delay</th>
            <th className="px-6 py-3.5 font-semibold">Hourly Limit</th>
            <th className="px-6 py-3.5 font-semibold">Created</th>
            <th className="px-6 py-3.5 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <tr key={index}>
                  {Array.from({ length: 6 }).map((__, cellIndex) => (
                    <td key={cellIndex} className="px-6 py-4">
                      <div className="h-4 animate-pulse rounded bg-slate-200" />
                    </td>
                  ))}
                </tr>
              ))
            : campaigns.map((campaign) => {
                const isBusy = busyId === campaign.id;

                return (
                  <tr
                    key={campaign.id}
                    className="transition-colors hover:bg-slate-50"
                  >
                    <td className="max-w-[280px] px-6 py-4">
                      <p className="truncate font-medium text-slate-900">
                        {campaign.subject}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <CampaignStatusBadge status={campaign.status} />
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {formatDuration(campaign.delayBetweenEmails)}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {formatNumber(campaign.hourlyLimit)} / hr
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {formatDate(campaign.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          loading={isBusy}
                          title="Start campaign"
                          onClick={() => onStart(campaign)}
                        >
                          <Play className="size-3.5" aria-hidden="true" />
                          Start
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => onView(campaign)}
                          title="View campaign details"
                        >
                          <Eye className="size-3.5" aria-hidden="true" />
                          Details
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                          onClick={() => onDelete(campaign)}
                          title="Delete campaign"
                        >
                          <Trash2 className="size-3.5" aria-hidden="true" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
        </tbody>
      </table>
    </div>
  );
}