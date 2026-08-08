"use client";

import React from "react";
import { Clock, Sun, Sunset, Moon, Check } from "lucide-react";

export interface TimeSlotItem {
  time: string; // e.g. "10:00 AM"
  period: "morning" | "afternoon" | "evening";
  available: boolean;
}

const DEFAULT_TIME_SLOTS: TimeSlotItem[] = [
  // Morning
  { time: "09:00 AM", period: "morning", available: true },
  { time: "09:30 AM", period: "morning", available: true },
  { time: "10:00 AM", period: "morning", available: true },
  { time: "10:30 AM", period: "morning", available: false },
  { time: "11:00 AM", period: "morning", available: true },
  // Afternoon
  { time: "01:30 PM", period: "afternoon", available: true },
  { time: "02:00 PM", period: "afternoon", available: true },
  { time: "02:30 PM", period: "afternoon", available: false },
  { time: "03:00 PM", period: "afternoon", available: true },
  { time: "04:00 PM", period: "afternoon", available: true },
  // Evening
  { time: "05:00 PM", period: "evening", available: true },
  { time: "05:30 PM", period: "evening", available: true },
  { time: "06:00 PM", period: "evening", available: true },
];

interface TimeSlotSelectorProps {
  selectedTime: string;
  onSelectTime: (time: string) => void;
  slots?: TimeSlotItem[];
}

export const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  selectedTime,
  onSelectTime,
  slots = DEFAULT_TIME_SLOTS,
}) => {
  const morningSlots = slots.filter((s) => s.period === "morning");
  const afternoonSlots = slots.filter((s) => s.period === "afternoon");
  const eveningSlots = slots.filter((s) => s.period === "evening");

  const renderGroup = (
    title: string,
    icon: React.ReactNode,
    groupSlots: TimeSlotItem[]
  ) => (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-[#64748B] flex items-center gap-1.5 uppercase tracking-wider">
        {icon}
        <span>{title}</span>
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
        {groupSlots.map((slot) => {
          const isSelected = selectedTime === slot.time;
          return (
            <button
              key={slot.time}
              type="button"
              disabled={!slot.available}
              onClick={() => onSelectTime(slot.time)}
              className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                !slot.available
                  ? "bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed line-through"
                  : isSelected
                  ? "bg-blue-50 border-[#2563EB] text-[#2563EB] ring-2 ring-[#2563EB] shadow-xs"
                  : "bg-white border-[#E2E8F0] text-[#0F172A] hover:border-blue-300 hover:bg-slate-50"
              }`}
            >
              <span>{slot.time}</span>
              {isSelected && <Check className="h-3.5 w-3.5 text-[#2563EB]" />}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-[#2563EB]" /> Select Time Slot
        </label>
        <span className="text-xs text-[#64748B]">All times in local timezone</span>
      </div>

      <div className="space-y-4">
        {morningSlots.length > 0 &&
          renderGroup(
            "Morning",
            <Sun className="h-3.5 w-3.5 text-amber-500" />,
            morningSlots
          )}

        {afternoonSlots.length > 0 &&
          renderGroup(
            "Afternoon",
            <Sunset className="h-3.5 w-3.5 text-orange-500" />,
            afternoonSlots
          )}

        {eveningSlots.length > 0 &&
          renderGroup(
            "Evening",
            <Moon className="h-3.5 w-3.5 text-indigo-500" />,
            eveningSlots
          )}
      </div>
    </div>
  );
};
