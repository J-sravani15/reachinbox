import { Users } from "lucide-react";

import { LeadStatusBadge } from "../ui/Badge";
import { EmptyState } from "../ui/EmptyState";
import type { Lead } from "../../types";

interface LeadTableProps {
  leads: Lead[];
  loading: boolean;
}

export function LeadTable({ leads, loading }: LeadTableProps) {
  if (!loading && leads.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No leads yet"
        description="Add your first lead to begin building your outreach list."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
            <th className="px-6 py-3.5 font-semibold">Email</th>
            <th className="px-6 py-3.5 font-semibold">First Name</th>
            <th className="px-6 py-3.5 font-semibold">Company</th>
            <th className="px-6 py-3.5 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <tr key={index}>
                  {Array.from({ length: 4 }).map((__, cellIndex) => (
                    <td key={cellIndex} className="px-6 py-4">
                      <div className="h-4 animate-pulse rounded bg-slate-200" />
                    </td>
                  ))}
                </tr>
              ))
            : leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="transition-colors hover:bg-slate-50"
                >
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {lead.email}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {lead.firstName || "—"}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {lead.company || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <LeadStatusBadge status={lead.status} />
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}