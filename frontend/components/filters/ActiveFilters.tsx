"use client";

import React from "react";
import { X } from "lucide-react";

export interface ActiveFilterTag {
  key: string;
  label: string;
  value: string;
}

interface ActiveFiltersProps {
  filters: ActiveFilterTag[];
  onRemove: (key: string, value: string) => void;
  onClearAll: () => void;
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  onRemove,
  onClearAll,
}) => {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 pt-3 pb-1">
      <span className="text-xs font-semibold text-[#64748B]">Active Filters:</span>
      {filters.map((filter) => (
        <span
          key={`${filter.key}-${filter.value}`}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-[#2563EB] border border-blue-200/70 text-xs font-semibold"
        >
          <span>{filter.label}</span>
          <button
            type="button"
            onClick={() => onRemove(filter.key, filter.value)}
            className="hover:text-blue-900 transition-colors p-0.5 rounded focus-visible:outline-none"
            aria-label={`Remove filter ${filter.label}`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="text-xs font-semibold text-[#EF4444] hover:underline ml-1 focus-visible:outline-none"
      >
        Clear All
      </button>
    </div>
  );
};
