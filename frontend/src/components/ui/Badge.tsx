import type { ReactNode } from "react";

import { cn } from "../../lib/cn";
import { titleCase } from "../../lib/format";

type BadgeTone = "indigo" | "emerald" | "amber" | "rose" | "slate" | "sky";

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}

const toneClasses: Record<BadgeTone, string> = {
  indigo: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  rose: "bg-rose-50 text-rose-700 ring-rose-200",
  sky: "bg-sky-50 text-sky-700 ring-sky-200",
  slate: "bg-slate-100 text-slate-600 ring-slate-200",
};

export function Badge({ children, tone = "slate", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

const campaignStatusTones: Record<string, BadgeTone> = {
  ACTIVE: "emerald",
  COMPLETED: "sky",
  PAUSED: "amber",
};

const leadStatusTones: Record<string, BadgeTone> = {
  PENDING: "amber",
  SENT: "emerald",
  FAILED: "rose",
  PROCESSING: "sky",
};

export function CampaignStatusBadge({
  status,
}: {
  status: string;
}) {
  return (
    <Badge tone={campaignStatusTones[status] ?? "slate"}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {titleCase(status)}
    </Badge>
  );
}

export function LeadStatusBadge({ status }: { status: string }) {
  return (
    <Badge tone={leadStatusTones[status] ?? "slate"}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {titleCase(status)}
    </Badge>
  );
}