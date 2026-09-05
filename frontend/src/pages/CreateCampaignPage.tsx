import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import { toast } from "sonner";

import { Button } from "../components/ui/Button";
import { getErrorMessage } from "../services/api";
import { createCampaign, resolveUserId } from "../services/campaigns";
import type { CampaignFormValues } from "../types";

const emptyForm: CampaignFormValues = {
  subject: "",
  body: "",
  delayBetweenEmails: "",
  hourlyLimit: "",
};

type FieldErrors = Partial<Record<keyof CampaignFormValues, string>>;

const inputClassName =
  "mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30";

export function CreateCampaignPage() {
  const navigate = useNavigate();
  const [values, setValues] = useState<CampaignFormValues>(emptyForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const setField = (field: keyof CampaignFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = (): FieldErrors => {
    const nextErrors: FieldErrors = {};
    const subject = values.subject.trim();
    const body = values.body.trim();
    const delay = Number(values.delayBetweenEmails);
    const hourlyLimit = Number(values.hourlyLimit);

    if (!subject) {
      nextErrors.subject = "Subject is required.";
    }

    if (!body) {
      nextErrors.body = "Email body is required.";
    } else if (body.length < 10) {
      nextErrors.body = "Email body should be at least 10 characters.";
    }

    if (!values.delayBetweenEmails) {
      nextErrors.delayBetweenEmails = "Delay is required.";
    } else if (!Number.isInteger(delay) || delay < 1) {
      nextErrors.delayBetweenEmails =
        "Delay must be a whole number of seconds, at least 1.";
    }

    if (!values.hourlyLimit) {
      nextErrors.hourlyLimit = "Hourly limit is required.";
    } else if (!Number.isInteger(hourlyLimit) || hourlyLimit < 1) {
      nextErrors.hourlyLimit =
        "Hourly limit must be a whole number, at least 1.";
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
      const userId = await resolveUserId();

      await createCampaign({
        userId,
        subject: values.subject.trim(),
        body: values.body.trim(),
        startTime: new Date().toISOString(),
        delayBetweenEmails: Number(values.delayBetweenEmails),
        hourlyLimit: Number(values.hourlyLimit),
      });

      toast.success("Campaign created successfully.");
      navigate("/campaigns");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          to="/campaigns"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to campaigns
        </Link>
        <h2 className="mt-2 text-xl font-bold text-slate-900">
          Create Campaign
        </h2>
        <p className="mt-0.5 text-sm text-slate-500">
          Set up a new outreach campaign and its sending rules.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="space-y-5">
          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-slate-700"
            >
              Subject
            </label>
            <input
              id="subject"
              type="text"
              value={values.subject}
              onChange={(event) => setField("subject", event.target.value)}
              placeholder="e.g. Boost your team's productivity with ReachInbox"
              className={inputClassName}
              disabled={submitting}
            />
            {errors.subject && (
              <p className="mt-1.5 text-sm text-rose-600">{errors.subject}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="body"
              className="block text-sm font-medium text-slate-700"
            >
              Email Body
            </label>
            <textarea
              id="body"
              rows={8}
              value={values.body}
              onChange={(event) => setField("body", event.target.value)}
              placeholder="Hi {{firstName}},&#10;&#10;I noticed your company is crushing it...&#10;&#10;Would you be open to a quick call this week?"
              className={`${inputClassName} resize-y`}
              disabled={submitting}
            />
            <div className="mt-1.5 flex items-start gap-1.5 text-xs text-slate-500">
              <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
              <span>
                Use {"{{firstName}}"} as a placeholder — it is replaced with each
                lead's first name at send time.
              </span>
            </div>
            {errors.body && (
              <p className="mt-1.5 text-sm text-rose-600">{errors.body}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="delayBetweenEmails"
                className="block text-sm font-medium text-slate-700"
              >
                Delay Between Emails (seconds)
              </label>
              <input
                id="delayBetweenEmails"
                type="number"
                min={1}
                step={1}
                value={values.delayBetweenEmails}
                onChange={(event) =>
                  setField("delayBetweenEmails", event.target.value)
                }
                placeholder="e.g. 60"
                className={inputClassName}
                disabled={submitting}
              />
              {errors.delayBetweenEmails && (
                <p className="mt-1.5 text-sm text-rose-600">
                  {errors.delayBetweenEmails}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="hourlyLimit"
                className="block text-sm font-medium text-slate-700"
              >
                Hourly Limit
              </label>
              <input
                id="hourlyLimit"
                type="number"
                min={1}
                step={1}
                value={values.hourlyLimit}
                onChange={(event) =>
                  setField("hourlyLimit", event.target.value)
                }
                placeholder="e.g. 50"
                className={inputClassName}
                disabled={submitting}
              />
              {errors.hourlyLimit && (
                <p className="mt-1.5 text-sm text-rose-600">
                  {errors.hourlyLimit}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link to="/campaigns" className="sm:self-center">
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            loading={submitting}
            icon={
              !submitting && <ArrowRight className="size-4" aria-hidden="true" />
            }
          >
            {submitting ? "Creating…" : "Create Campaign"}
          </Button>
        </div>
      </form>
    </div>
  );
}