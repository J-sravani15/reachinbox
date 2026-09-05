import { Link, useLocation } from "react-router-dom";
import { Menu, Plus } from "lucide-react";

import { Button } from "../ui/Button";

interface NavbarProps {
  title: string;
  onMenuClick: () => void;
}

export function Navbar({ title, onMenuClick }: NavbarProps) {
  const { pathname } = useLocation();
  const showNewCampaign = pathname !== "/campaigns/create";

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
        <h1 className="truncate text-lg font-semibold text-slate-900">
          {title}
        </h1>

        <div className="flex items-center gap-3">
          {showNewCampaign && (
            <Link to="/campaigns/create" className="hidden sm:block">
              <Button size="sm" icon={<Plus className="size-4" aria-hidden="true" />}>
                New Campaign
              </Button>
            </Link>
          )}
          <div
            className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 text-sm font-bold text-white"
            title="ReachInbox"
          >
            RI
          </div>
        </div>
      </div>
    </header>
  );
}