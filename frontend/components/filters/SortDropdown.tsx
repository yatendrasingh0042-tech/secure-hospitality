"use client";

import React from "react";
import { ArrowUpDown } from "lucide-react";

export interface SortOption {
  label: string;
  value: string;
}

interface SortDropdownProps {
  options: SortOption[];
  value: string;
  onChange: (val: string) => void;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({
  options,
  value,
  onChange,
}) => {
  return (
    <div className="relative inline-flex items-center gap-2">
      <span className="text-xs font-semibold text-[#64748B] flex items-center gap-1 shrink-0">
        <ArrowUpDown className="h-3.5 w-3.5" /> Sort by:
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 pl-3 pr-8 text-xs font-semibold text-[#0F172A] bg-white border border-[#E2E8F0] rounded-xl hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-colors cursor-pointer appearance-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
