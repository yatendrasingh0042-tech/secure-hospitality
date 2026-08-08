"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface LoadingStateProps {
  label?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  label = "Loading information...",
  className = "",
}) => {
  return (
    <Card radius="xl" className={`p-8 text-center max-w-sm mx-auto space-y-3 bg-white/80 ${className}`}>
      <Loader2 className="h-8 w-8 text-[#2563EB] animate-spin mx-auto" />
      <p className="text-xs font-semibold text-[#64748B]">{label}</p>
    </Card>
  );
};
