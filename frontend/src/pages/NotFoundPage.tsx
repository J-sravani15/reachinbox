import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

import { Button } from "../components/ui/Button";

export function NotFoundPage() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
        <Compass className="size-7" aria-hidden="true" />
      </div>
      <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
        404
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        This page doesn't exist or has been moved.
      </p>
      <Link to="/" className="mt-6">
        <Button>Back to Dashboard</Button>
      </Link>
    </div>
  );
}