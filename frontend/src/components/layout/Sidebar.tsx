import { Link, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Mail,
  Plus,
  Send,
  Sparkles,
  Users,
  X,
} from "lucide-react";

import { cn } from "../../lib/cn";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navigation = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Campaigns", to: "/campaigns", icon: Send },
  { label: "Leads", to: "/leads", icon: Users },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-slate-950 text-slate-300 transition-transform duration-200 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <Link to="/" className="flex items-center gap-2.5" onClick={onClose}>
            <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 text-white shadow-lg shadow-indigo-950/50">
              <Mail className="size-5" aria-hidden="true" />
            </span>
            <span className="text-lg font-bold tracking-tight text-white">
              ReachInbox
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close navigation"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {navigation.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      "size-5 shrink-0 transition-colors",
                      isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"
                    )}
                    aria-hidden="true"
                  />
                  {label}
                </>
              )}
            </NavLink>
          ))}

          <div className="pt-4">
            <Link
              to="/campaigns/create"
              onClick={onClose}
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-950/40 transition-colors hover:bg-indigo-500"
            >
              <Plus className="size-4" aria-hidden="true" />
              New Campaign
            </Link>
          </div>

          <div className="rounded-xl bg-white/5 p-4 pt-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-300">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Pro tip
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Use {"{{firstName}}"} in your email body to personalize every
              message automatically.
            </p>
          </div>
        </nav>

        <div className="border-t border-white/10 px-5 py-4 text-xs text-slate-500">
          ReachInbox v1.0
        </div>
      </aside>
    </>
  );
}