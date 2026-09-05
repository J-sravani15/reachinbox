import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

const pageTitles: Array<{ pattern: RegExp; title: string }> = [
  { pattern: /^\/$/, title: "Dashboard" },
  { pattern: /^\/campaigns\/create$/, title: "New Campaign" },
  { pattern: /^\/campaigns\/[^/]+$/, title: "Campaign Details" },
  { pattern: /^\/campaigns$/, title: "Campaigns" },
  { pattern: /^\/leads$/, title: "Leads" },
];

function getPageTitle(pathname: string): string {
  const match = pageTitles.find(({ pattern }) => pattern.test(pathname));
  return match?.title ?? "ReachInbox";
}

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar
          title={getPageTitle(pathname)}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}