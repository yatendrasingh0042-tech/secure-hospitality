"use client";

import React from "react";
import { Check, Clock } from "lucide-react";
import { EmergencyStatusType } from "@/context/EmergencyContext";

interface TimelineStep {
  id: EmergencyStatusType;
  label: string;
}

const TIMELINE_STEPS: TimelineStep[] = [
  { id: "requested", label: "Request Submitted" },
  { id: "assigned", label: "Assistance Assigned" },
  { id: "enRoute", label: "Assistance En Route" },
  { id: "arrived", label: "Arrived at Location" },
  { id: "completed", label: "Completed" },
];

const statusOrder: Record<EmergencyStatusType, number> = {
  idle: 0,
  requesting: 1,
  requested: 1,
  assigned: 2,
  enRoute: 3,
  arrived: 4,
  completed: 5,
  cancelled: -1,
};

interface EmergencyTimelineProps {
  currentStatus: EmergencyStatusType;
}

export const EmergencyTimeline: React.FC<EmergencyTimelineProps> = ({
  currentStatus,
}) => {
  const currentIndex = statusOrder[currentStatus] || 0;

  return (
    <div className="space-y-4">
      {/* Screen reader accessible status announcement */}
      <div role="status" aria-live="polite" className="sr-only">
        Emergency request status updated to: {currentStatus}
      </div>

      <div className="space-y-3">
        {TIMELINE_STEPS.map((step, idx) => {
          const stepIndex = idx + 1;
          const isDone = currentIndex > stepIndex;
          const isCurrent = currentIndex === stepIndex;

          return (
            <div key={step.id} className="flex items-center gap-3">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                  isDone
                    ? "bg-[#10B981] text-white"
                    : isCurrent
                    ? "bg-[#EF4444] text-white ring-4 ring-red-100"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {isDone ? <Check className="h-4 w-4" /> : isCurrent ? <Clock className="h-4 w-4 animate-spin" /> : stepIndex}
              </div>

              <div className="flex-1">
                <p
                  className={`text-xs font-bold ${
                    isCurrent
                      ? "text-[#EF4444]"
                      : isDone
                      ? "text-[#0F172A]"
                      : "text-slate-400"
                  }`}
                >
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
