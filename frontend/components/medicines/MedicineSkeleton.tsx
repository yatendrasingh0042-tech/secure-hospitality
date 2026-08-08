"use client";

import React from "react";
import { Card } from "@/components/ui/Card";

export const MedicineSkeleton: React.FC = () => {
  return (
    <Card radius="xl" className="h-full border border-[#E2E8F0] p-5 space-y-4 bg-white animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-5 w-20 bg-slate-200 rounded-lg" />
        <div className="h-5 w-16 bg-slate-200 rounded-lg" />
      </div>

      <div className="h-32 w-full bg-slate-100 rounded-2xl" />

      <div className="space-y-2">
        <div className="h-5 w-3/4 bg-slate-200 rounded-md" />
        <div className="h-3.5 w-1/2 bg-slate-200 rounded-md" />
      </div>

      <div className="h-4 w-1/3 bg-slate-200 rounded-md" />

      <div className="pt-2 flex justify-between items-center">
        <div className="h-6 w-20 bg-slate-200 rounded-md" />
        <div className="h-9 w-28 bg-slate-200 rounded-xl" />
      </div>
    </Card>
  );
};
