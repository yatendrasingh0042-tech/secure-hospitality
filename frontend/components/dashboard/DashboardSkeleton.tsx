"use client";

import React from "react";
import { Card } from "@/components/ui/Card";

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-16 bg-slate-200 rounded-2xl w-full" />
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} radius="xl" className="h-24 bg-slate-200 border-none" />
        ))}
      </div>
      <Card radius="xl" className="h-44 bg-slate-200 border-none" />
    </div>
  );
};
