"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";

export const HospitalSkeleton: React.FC = () => {
  return (
    <Card radius="xl" className="h-full flex flex-col justify-between border border-[#E2E8F0] animate-pulse">
      <CardHeader>
        <div className="flex items-center justify-between mb-3">
          <div className="h-12 w-12 rounded-2xl bg-slate-200" />
          <div className="h-6 w-20 rounded-full bg-slate-200" />
        </div>
        <div className="h-5 w-3/4 rounded bg-slate-200 mb-2" />
        <div className="h-4 w-1/2 rounded bg-slate-200" />
        <div className="h-4 w-2/3 rounded bg-slate-100 mt-2" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="h-8 w-full rounded-xl bg-slate-100" />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-10 rounded-lg bg-slate-100" />
          <div className="h-10 rounded-lg bg-slate-100" />
        </div>
        <div className="h-10 w-full rounded-xl bg-slate-200" />
      </CardContent>
    </Card>
  );
};
