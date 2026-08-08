"use client";

import React from "react";
import Link from "next/link";
import { Star, MapPin, Building2, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Hospital } from "@/types/hospital";

interface HospitalCardProps {
  hospital: Hospital;
}

export const HospitalCard: React.FC<HospitalCardProps> = ({ hospital }) => {
  return (
    <Card variant="interactive" radius="xl" className="h-full flex flex-col justify-between border border-[#E2E8F0] hover:border-indigo-200">
      <CardHeader>
        <div className="flex items-center justify-between mb-3">
          <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
            <Building2 className="h-6 w-6" />
          </div>
          <Badge
            variant={hospital.isOpen247 ? "success" : "neutral"}
            size="sm"
            showDot={hospital.isOpen247}
          >
            {hospital.isOpen247 ? "24/7 Open" : "Closed"}
          </Badge>
        </div>

        <CardTitle className="text-lg font-bold text-[#0F172A] hover:text-[#2563EB] transition-colors">
          <Link href={`/hospitals/${hospital.id}`}>{hospital.name}</Link>
        </CardTitle>
        <p className="text-xs font-semibold text-indigo-600">
          {hospital.type}
        </p>
        <p className="text-xs text-[#64748B] flex items-center gap-1 mt-1.5 truncate">
          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{hospital.location}</span>
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Rating & Distance Row */}
        <div className="py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 font-semibold text-[#0F172A]">
            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
            <span>{hospital.rating}</span>
            <span className="text-slate-400 font-normal">({hospital.reviewsCount})</span>
          </div>
          <span className="font-bold text-[#2563EB]">
            {hospital.distanceKm} km away
          </span>
        </div>

        {/* ICU & General Beds Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 rounded-lg bg-emerald-50/80 border border-emerald-100 text-center">
            <p className="text-[10px] text-slate-500">ICU Beds</p>
            <p className="font-bold text-[#10B981]">{hospital.icuBedsAvailable} Open</p>
          </div>
          <div className="p-2 rounded-lg bg-blue-50/80 border border-blue-100 text-center">
            <p className="text-[10px] text-slate-500">General Beds</p>
            <p className="font-bold text-[#2563EB]">{hospital.generalBedsAvailable} Open</p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full justify-between"
          asChild
        >
          <Link href={`/hospitals/${hospital.id}`}>
            <span>View Hospital</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
