"use client";

import React from "react";
import { Activity, Calendar, Package, UserCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";

export const RecentActivity: React.FC = () => {
  const activities = [
    {
      id: "act-1",
      title: "Appointment Booked",
      desc: "Dr. Ananya Sharma consultation booked for Aug 12.",
      time: "Yesterday, 4:30 PM",
      icon: Calendar,
      color: "bg-blue-500",
    },
    {
      id: "act-2",
      title: "Medicine Order Placed",
      desc: "Order #SH-2026-001 containing 3 OTC items confirmed.",
      time: "2 days ago",
      icon: Package,
      color: "bg-emerald-500",
    },
    {
      id: "act-3",
      title: "Profile Onboarding Completed",
      desc: "Emergency contacts & healthcare preferences configured.",
      time: "3 days ago",
      icon: UserCheck,
      color: "bg-purple-500",
    },
  ];

  return (
    <Card radius="xl" className="p-6 bg-white border border-[#E2E8F0] space-y-4 shadow-xs">
      <h3 className="font-bold text-base text-[#0F172A] flex items-center gap-2 pb-3 border-b border-slate-100">
        <Activity className="h-5 w-5 text-[#2563EB]" /> Recent Account Activity
      </h3>

      <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
        {activities.map((act) => {
          const Icon = act.icon;
          return (
            <div key={act.id} className="relative flex items-start gap-3 pl-8">
              <div
                className={`absolute left-0 top-0.5 h-7 w-7 rounded-full text-white flex items-center justify-center font-bold text-xs ring-4 ring-white ${act.color}`}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="font-bold text-xs text-[#0F172A]">{act.title}</p>
                <p className="text-[11px] text-[#64748B] mt-0.5">{act.desc}</p>
                <span className="text-[10px] text-slate-400 font-mono mt-1 block">{act.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
