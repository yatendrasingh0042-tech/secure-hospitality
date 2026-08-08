"use client";

import React from "react";
import Link from "next/link";
import { Siren, ArrowRight, MapPin } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { HOSPITALS_DATA } from "@/data/hospitals";

export const NearbyEmergencyCare: React.FC = () => {
  const erHospitals = HOSPITALS_DATA.filter((h) => h.emergencyAvailable).slice(0, 2);

  return (
    <Card radius="xl" className="p-6 bg-white border border-[#E2E8F0] space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-base text-[#0F172A] flex items-center gap-2">
          <Siren className="h-5 w-5 text-[#EF4444]" /> Nearby 24/7 Emergency Care
        </h3>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/hospitals">View All</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {erHospitals.map((hosp) => (
          <div
            key={hosp.id}
            className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="success" size="sm" showDot>
                  24/7 ER Ready
                </Badge>
                <span className="text-xs font-semibold text-[#2563EB]">
                  {hosp.distanceKm} km away
                </span>
              </div>
              <h4 className="font-bold text-sm text-[#0F172A] line-clamp-1">{hosp.name}</h4>
              <p className="text-xs text-[#64748B] flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-400" /> {hosp.location}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
              <span className="font-extrabold text-[#EF4444]">{hosp.emergencyPhone}</span>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/hospitals/${hosp.id}`}>
                  Details <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
