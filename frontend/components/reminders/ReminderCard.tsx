"use client";

import React from "react";
import { Pill, Calendar, Heart, Clock, Trash2 } from "lucide-react";
import { Reminder, useReminders } from "@/context/ReminderContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface ReminderCardProps {
  reminder: Reminder;
}

const typeIcons = {
  Medication: Pill,
  Appointment: Calendar,
  Health: Heart,
  General: Clock,
};

export const ReminderCard: React.FC<ReminderCardProps> = ({ reminder }) => {
  const { toggleReminder, deleteReminder } = useReminders();
  const Icon = typeIcons[reminder.type] || Clock;

  return (
    <Card
      radius="xl"
      className={`p-4 sm:p-5 bg-white border transition-all space-y-3 ${
        reminder.enabled
          ? "border-purple-200 shadow-sm"
          : "border-slate-200 opacity-60 bg-slate-50/50"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`h-11 w-11 rounded-2xl flex items-center justify-center font-bold shrink-0 ${
              reminder.enabled
                ? "bg-purple-100 text-purple-600"
                : "bg-slate-200 text-slate-500"
            }`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-[#0F172A]">{reminder.title}</h4>
              <Badge variant="info" size="sm">
                {reminder.type}
              </Badge>
            </div>
            <p className="text-xs text-[#64748B] font-semibold mt-0.5">
              {reminder.time} · {reminder.repeat}
            </p>
          </div>
        </div>

        {/* Toggle Switch */}
        <button
          type="button"
          onClick={() => toggleReminder(reminder.id)}
          className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
            reminder.enabled ? "bg-purple-600 justify-end" : "bg-slate-300 justify-start"
          }`}
          aria-label={`Toggle reminder ${reminder.title}`}
        >
          <div className="h-4 w-4 rounded-full bg-white shadow-md" />
        </button>
      </div>

      {reminder.notes && (
        <p className="text-xs text-[#64748B] bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
          {reminder.notes}
        </p>
      )}

      <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100 text-xs">
        <button
          type="button"
          onClick={() => deleteReminder(reminder.id)}
          className="text-slate-400 hover:text-red-600 font-semibold p-1 flex items-center gap-1"
        >
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </button>
      </div>
    </Card>
  );
};
