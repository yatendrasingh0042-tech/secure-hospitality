"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  children,
  defaultOpen = true,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-slate-200/80 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-1 text-xs font-bold uppercase tracking-wider text-[#0F172A] hover:text-[#2563EB] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded-md"
      >
        <span>{title}</span>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
};
