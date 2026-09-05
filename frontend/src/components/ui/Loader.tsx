import { Loader2 } from "lucide-react";

interface LoaderProps {
  label?: string;
  className?: string;
}

export function Loader({ label = "Loading…", className = "" }: LoaderProps) {
  return (
    <div
      className={`flex min-h-40 flex-col items-center justify-center gap-3 text-slate-500 ${className}`}
    >
      <Loader2 className="size-7 animate-spin text-indigo-600" />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}