"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Pill,
  FileText,
  Clock,
  User,
  Siren,
} from "lucide-react";

interface NavLink {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isEmergency?: boolean;
}

const DASHBOARD_LINKS: NavLink[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Appointments", href: "/appointments", icon: Calendar },
  { label: "Medicines & Orders", href: "/medicines", icon: Pill },
  { label: "Health Records", href: "/health-records", icon: FileText },
  { label: "Reminders", href: "/reminders", icon: Clock },
  { label: "Emergency", href: "/emergency", icon: Siren, isEmergency: true },
  { label: "My Profile", href: "/profile", icon: User },
];

export const DashboardSidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-white border-r border-[#E2E8F0] min-h-screen p-4 space-y-6">
        <div className="px-3 py-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
            Patient Portal
          </span>
        </div>

        <nav className="space-y-1">
          {DASHBOARD_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-bold text-xs transition-all ${
                  isActive
                    ? link.isEmergency
                      ? "bg-red-500 text-white shadow-sm"
                      : "bg-[#2563EB] text-white shadow-sm"
                    : link.isEmergency
                    ? "text-[#EF4444] hover:bg-red-50"
                    : "text-[#64748B] hover:bg-slate-100 hover:text-[#0F172A]"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation Bar with Safe Area Support */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] px-3 flex items-center justify-around shadow-lg">
        {DASHBOARD_LINKS.slice(0, 5).map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 p-1 font-semibold text-[10px] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded-lg ${
                isActive ? "text-[#2563EB]" : "text-[#64748B]"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{link.label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
};
