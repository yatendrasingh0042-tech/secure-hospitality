"use client";

import React from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface FilterButtonProps {
  activeCount: number;
  onClick: () => void;
}

export const FilterButton: React.FC<FilterButtonProps> = ({
  activeCount,
  onClick,
}) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      leftIcon={<SlidersHorizontal className="h-4 w-4" />}
      className="lg:hidden relative"
    >
      <span>Filters</span>
      {activeCount > 0 && (
        <span className="h-5 w-5 rounded-full bg-[#2563EB] text-white font-bold text-[10px] flex items-center justify-center ml-1">
          {activeCount}
        </span>
      )}
    </Button>
  );
};
