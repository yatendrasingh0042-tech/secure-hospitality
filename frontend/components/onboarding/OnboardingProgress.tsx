"use client";

import React from "react";
import { Check } from "lucide-react";

interface Step {
  number: number;
  label: string;
}

const STEPS: Step[] = [
  { number: 1, label: "Profile" },
  { number: 2, label: "Emergency Contacts" },
  { number: 3, label: "Preferences" },
];

interface OnboardingProgressProps {
  currentStep: number;
}

export const OnboardingProgress: React.FC<OnboardingProgressProps> = ({ currentStep }) => {
  return (
    <div className="w-full max-w-xl mx-auto mb-8">
      {/* Desktop Horizontal Stepper */}
      <div className="hidden sm:flex items-center justify-between relative">
        {/* Line behind steps */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-[#2563EB] -translate-y-1/2 z-0 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
        />

        {STEPS.map((step) => {
          const isDone = currentStep > step.number;
          const isCurrent = currentStep === step.number;

          return (
            <div key={step.number} className="relative z-10 flex flex-col items-center gap-1.5 bg-[#F8FAFC] px-2">
              <div
                className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  isDone
                    ? "bg-[#10B981] text-white"
                    : isCurrent
                    ? "bg-[#2563EB] text-white ring-4 ring-blue-100"
                    : "bg-white border-2 border-slate-300 text-slate-400"
                }`}
              >
                {isDone ? <Check className="h-4 w-4" /> : step.number}
              </div>
              <span
                className={`text-xs font-bold ${
                  isCurrent ? "text-[#2563EB]" : isDone ? "text-[#0F172A]" : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile Compact Progress Bar */}
      <div className="sm:hidden space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-[#2563EB]">Step {currentStep} of 3</span>
          <span className="text-[#0F172A]">{STEPS[currentStep - 1]?.label}</span>
        </div>
        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#2563EB] transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
