import { useState, type FormEvent } from "react";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

import { LeadTable } from "../components/leads/LeadTable";
import { Button } from "../components/ui/Button";
import { ErrorBanner } from "../components/ui/ErrorBanner";
import { useCampaigns } from "../hooks/useCampaigns";
import { useLeads } from "../hooks/useLeads";
import { getErrorMessage } from "../services/api";
import { createLead } from "../services/leads";
import type { LeadFormValues } from "../types";

const emptyForm: LeadFormValues = {
  campaignId: "",
  email: "",
  firstName: "",
  company: "",
};

type FieldErrors = Partial<Record<keyof LeadFormValues, string>>;

const inputClassName =
  "mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30";

export function LeadsPage() {
  const { leads, loading: leadsLoading, error: leadsError, reload: reloadLeads } =
    useLeads();
  const { campaigns, loading: campaignsLoading, error: campaignsError, reload: reloadCampaigns } =
    useCampaigns();
  const [values, setValues] = useState<LeadFormValues>(emptyForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const setField = (field: keyof LeadFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = (): FieldErrors => {
    const nextErrors: FieldErrors = {};
    const email = values.email.trim();

    if (!values.campaignId) {
      nextErrors.campaignId = "Select a campaign.";
    }

    if (!email) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    return nextErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    setSubmitting(true);

    try {
      await createLead({
        campaignId: values.campaignId,
        email: values.email.trim(),
        firstName: values.firstName.trim(),
        company: values.company.trim(),
      });

      toast.success("Lead added to the campaign.");
      setValues(emptyForm);
      await reloadLeads();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const loadError = leadsError ?? campaignsError;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Leads</h2>
        <p className="mt-0.5 text-sm text-slate-500">
          Add contacts to campaigns and track their outreach status.
        </p>
      </div>

      {loadError && (
        <ErrorBanner
          message={loadError}
          onRetry={() => {
            void reloadLeads();
            void reloadCampaigns();
          }}
        />
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-1 lg:self-start"
        >
          <div className="flex items-center gap-2">
            <UserPlus className="size-5 text-indigo-600" aria-hidden="true" />
            <h3 className="font-semibold text-slate-900">Add Lead</h3>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="campaignId"
                className="block text-sm font-medium text-slate-700"
              >
                Campaign
              </label>
              <select
                id="campaignId"
                value={values.campaignId}
                onChange={(event) => setField("campaignId", event.target.value)}
                className={inputClassName}
                disabled={submitting || campaignsLoading}
              >
                <option value="">
                  {campaignsLoading
                    ? "Loading campaigns…"
                    : "Select a campaign"}
                </option>
                {campaigns.map((campaign) => (
                  <option key={campaign.id} value={campaign.id}>
                    {campaign.subject}
                  </option>
                ))}
              </select>
              {errors.campaignId && (
                <p className="mt-1.5 text-sm text-rose-600">
                  {errors.campaignId}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={values.email}
                onChange={(event) => setField("email", event.target.value)}
                placeholder="lead@company.com"
                className={inputClassName}
                disabled={submitting}
              />
              {errors.email && (
                <p className="mt-1.5 text-sm text-rose-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-slate-700"
              >
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={values.firstName}
                onChange={(event) => setField("firstName", event.target.value)}
                placeholder="e.g. Jane"
                className={inputClassName}
                disabled={submitting}
              />
            </div>

            <div>
              <label
                htmlFor="company"
                className="block text-sm font-medium text-slate-700"
              >
                Company
              </label>
              <input
                id="company"
                type="text"
                value={values.company}
                onChange={(event) => setField("company", event.target.value)}
                placeholder="e.g. Acme Inc."
                className={inputClassName}
                disabled={submitting}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="mt-6 w-full"
            loading={submitting}
            icon={
              !submitting && <UserPlus className="size-4" aria-hidden="true" />
            }
          >
            {submitting ? "Adding…" : "Add Lead"}
          </Button>
        </form>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
          <LeadTable leads={leads} loading={leadsLoading} />
        </div>
      </div>
    </div>
  );
}