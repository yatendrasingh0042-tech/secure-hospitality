"use client";

import React, { useState } from "react";
import { Bell, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { NotificationPanel } from "./NotificationPanel";

export const DashboardHeader: React.FC = () => {
  const { user } = useAuth();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const userName = user?.firstName || "Yatendra";

  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Good evening, {userName}
          </h1>
          <Sparkles className="h-5 w-5 text-amber-500" />
        </div>
        <p className="text-xs sm:text-sm text-[#64748B]">
          Here&apos;s your central healthcare overview and active schedules.
        </p>
      </div>

      {/* Notification Bell Action */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsNotifOpen(true)}
          className="relative p-2.5 rounded-2xl bg-white border border-slate-200 text-[#0F172A] hover:bg-slate-100 transition-colors shadow-xs"
          aria-label="Open notifications"
        >
          <Bell className="h-5 w-5 text-[#0F172A]" />
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#EF4444] text-white font-bold text-[10px] flex items-center justify-center border-2 border-white">
            2
          </span>
        </button>

        <NotificationPanel isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
      </div>
    </div>
  );
};
