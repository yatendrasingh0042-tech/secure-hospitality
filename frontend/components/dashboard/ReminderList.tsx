"use client";

import React from "react";
import Link from "next/link";
import { Clock, Pill, Calendar, Heart, Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useReminders } from "@/context/ReminderContext";

export const ReminderList: React.FC = () => {
  const { reminders, toggleReminder } = useReminders();

  const typeIcons = {
    Medication: Pill,
    Appointment: Calendar,
    Health: Heart,
    General: Clock,
  };

  return (
    <Card radius="xl" className="p-6 bg-white border border-[#E2E8F0] space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-base text-[#0F172A] flex items-center gap-2">
          <Clock className="h-5 w-5 text-purple-600" /> Today&apos;s Active Reminders
        </h3>
        <Button variant="ghost" size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />} asChild>
          <Link href="/reminders">Add Reminder</Link>
        </Button>
      </div>

      <div className="space-y-3">
        {reminders.slice(0, 3).map((r) => {
          const Icon = typeIcons[r.type] || Clock;
          return (
            <div
              key={r.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                r.enabled ? "bg-purple-50/50 border-purple-100" : "bg-slate-50 border-slate-200 opacity-60"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                    r.enabled ? "bg-purple-100 text-purple-600" : "bg-slate-200 text-slate-500"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-bold text-xs text-[#0F172A]">{r.title}</p>
                  <p className="text-[11px] text-[#64748B]">
                    {r.time} · {r.repeat}
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                onClick={() => toggleReminder(r.id)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  r.enabled ? "bg-purple-600 justify-end" : "bg-slate-300 justify-start"
                }`}
                aria-label={`Toggle reminder ${r.title}`}
              >
                <div className="h-4 w-4 rounded-full bg-white shadow-md" />
              </button>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
