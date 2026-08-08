"use client";

import React from "react";
import Link from "next/link";
import { Star, MapPin, Clock, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Doctor } from "@/types/doctor";

interface DoctorCardProps {
  doctor: Doctor;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  return (
    <Card variant="interactive" radius="xl" className="h-full flex flex-col justify-between border border-[#E2E8F0] hover:border-blue-200">
      <CardHeader>
        {/* Avatar & Availability Badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className={`h-14 w-14 rounded-2xl ${doctor.avatarColor} text-white font-bold text-lg flex items-center justify-center shadow-md`}>
            {doctor.initials}
          </div>
          <Badge
            variant={doctor.availability === "Available Today" ? "success" : "neutral"}
            size="sm"
            showDot={doctor.availability === "Available Today"}
          >
            {doctor.availability}
          </Badge>
        </div>

        <CardTitle className="text-lg font-bold text-[#0F172A] hover:text-[#2563EB] transition-colors">
          <Link href={`/doctors/${doctor.id}`}>{doctor.name}</Link>
        </CardTitle>
        <p className="text-xs font-semibold text-[#2563EB]">
          {doctor.specialization}
        </p>

        <p className="text-xs text-[#64748B] line-clamp-2 mt-2 leading-relaxed">
          {doctor.about}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Ratings & Experience Row */}
        <div className="py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 font-semibold text-[#0F172A]">
            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
            <span>{doctor.rating}</span>
            <span className="text-slate-400 font-normal">({doctor.reviewsCount})</span>
          </div>
          <div className="flex items-center gap-1 text-[#64748B]">
            <Clock className="h-3.5 w-3.5" />
            <span>{doctor.experienceYears}+ yrs exp</span>
          </div>
        </div>

        {/* Hospital Affiliation & Fee */}
        <div className="space-y-1.5 text-xs text-[#64748B]">
          <div className="flex items-center gap-1 truncate">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span className="truncate">{doctor.hospital}</span>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-slate-500">Consultation Fee</span>
            <span className="font-extrabold text-sm text-[#0F172A]">${doctor.consultationFee}</span>
          </div>
        </div>

        {/* Actions Row */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-center"
            asChild
          >
            <Link href={`/doctors/${doctor.id}`}>View Profile</Link>
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="w-full justify-center"
            asChild
          >
            <Link href={`/appointments/book?doctorId=${doctor.id}`}>
              Book
              <ArrowRight className="h-3.5 w-3.5 ml-2" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
