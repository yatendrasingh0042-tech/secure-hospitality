"use client";

import React from "react";
import { Calendar as CalendarIcon } from "lucide-react";

export interface DateOption {
  dayLabel: string; // e.g. "Today", "Tomorrow", "Fri, Aug 14"
  dateFormatted: string; // e.g. "Aug 12"
  available: boolean;
  isToday?: boolean;
}

const DEFAULT_DATES: DateOption[] = [
  { dayLabel: "Today", dateFormatted: "Aug 10", available: true, isToday: true },
  { dayLabel: "Tomorrow", dateFormatted: "Aug 11", available: true },
  { dayLabel: "Friday", dateFormatted: "Aug 12", available: true },
  { dayLabel: "Saturday", dateFormatted: "Aug 13", available: true },
  { dayLabel: "Sunday", dateFormatted: "Aug 14", available: false },
  { dayLabel: "Monday", dateFormatted: "Aug 15", available: true },
];

interface DateSelectorProps {
  selectedDate: string;
  onSelectDate: (dateLabel: string) => void;
  dates?: DateOption[];
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  onSelectDate,
  dates = DEFAULT_DATES,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] flex items-center gap-1.5">
          <CalendarIcon className="h-4 w-4 text-[#2563EB]" /> Select Appointment Date
        </label>
        <span className="text-xs text-[#64748B]">Showing next 6 days</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {dates.map((item) => {
          const isSelected = selectedDate === item.dayLabel;

          return (
            <button
              key={item.dayLabel}
              type="button"
              disabled={!item.available}
              onClick={() => onSelectDate(item.dayLabel)}
              className={`p-3.5 rounded-2xl border transition-all text-center flex flex-col items-center justify-between gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                !item.available
                  ? "bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed"
                  : isSelected
                  ? "bg-[#2563EB] text-white border-[#2563EB] shadow-md scale-102"
                  : "bg-white border-[#E2E8F0] text-[#0F172A] hover:border-blue-300 hover:bg-blue-50/40"
              }`}
            >
              <div className="flex items-center gap-1">
                {item.isToday && (
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isSelected ? "bg-white" : "bg-[#10B981]"
                    }`}
                  />
                )}
                <span className="text-xs font-bold">{item.dayLabel}</span>
              </div>
              <span
                className={`text-[11px] ${
                  isSelected ? "text-blue-100" : "text-[#64748B]"
                }`}
              >
                {item.dateFormatted}
              </span>
              {!item.available && (
                <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
                  Booked
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
