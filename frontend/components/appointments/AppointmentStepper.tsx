"use client";

import React from "react";
import { Check } from "lucide-react";

export interface StepItem {
  id: number;
  label: string;
}

const STEPS: StepItem[] = [
  { id: 1, label: "Doctor / Provider" },
  { id: 2, label: "Consultation Type" },
  { id: 3, label: "Date & Time" },
  { id: 4, label: "Patient Details" },
  { id: 5, label: "Review & Confirm" },
];

interface AppointmentStepperProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export const AppointmentStepper: React.FC<AppointmentStepperProps> = ({
  currentStep,
  onStepClick,
}) => {
  return (
    <div className="w-full">
      {/* Mobile Compact Stepper Bar */}
      <div className="md:hidden bg-white p-4 rounded-2xl border border-[#E2E8F0] mb-6 shadow-2xs space-y-2">
        <div className="flex justify-between items-center text-xs font-semibold text-[#0F172A]">
          <span>
            Step {currentStep} of {STEPS.length}
          </span>
          <span className="text-[#2563EB] font-bold">
            {STEPS.find((s) => s.id === currentStep)?.label}
          </span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#2563EB] transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop Horizontal Stepper */}
      <div className="hidden md:flex items-center justify-between bg-white p-5 rounded-3xl border border-[#E2E8F0] mb-8 shadow-xs relative">
        {STEPS.map((step, idx) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isClickable = isCompleted && onStepClick;

          return (
            <React.Fragment key={step.id}>
              <div
                onClick={() => isClickable && onStepClick(step.id)}
                className={`flex items-center gap-3 cursor-default select-none ${
                  isClickable ? "cursor-pointer group" : ""
                }`}
              >
                <div
                  className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-xs transition-all ${
                    isCompleted
                      ? "bg-[#10B981] text-white"
                      : isCurrent
                      ? "bg-[#2563EB] text-white ring-4 ring-blue-100"
                      : "bg-slate-100 text-[#64748B]"
                  }`}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : step.id}
                </div>

                <span
                  className={`text-xs font-bold tracking-tight transition-colors ${
                    isCurrent
                      ? "text-[#2563EB]"
                      : isCompleted
                      ? "text-[#0F172A] group-hover:text-[#2563EB]"
                      : "text-[#64748B]"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {idx < STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-3 transition-colors ${
                    currentStep > step.id ? "bg-[#10B981]" : "bg-slate-200"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
