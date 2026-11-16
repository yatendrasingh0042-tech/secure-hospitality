"use client";

import React from "react";
import { Star, MapPin, Clock, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Doctor } from "@/data/doctors";
import { formatCurrency } from "@/lib/formatCurrency";

interface DoctorCardProps {
  doctor: Doctor;
  onSelect: (doctor: Doctor) => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onSelect }) => {
  return (
    <Card variant="interactive" radius="xl" className="h-full flex flex-col justify-between border border-[#E2E8F0] hover:border-blue-200">
      <CardHeader>
        {/* Avatar & Availability Row */}
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

        <CardTitle className="text-lg font-bold text-[#0F172A]">
          {doctor.name}
        </CardTitle>
        <p className="text-xs font-semibold text-[#2563EB]">
          {doctor.specialty || doctor.specialization}
        </p>

        <p className="text-xs text-[#64748B] line-clamp-2 mt-2 leading-relaxed">
          {doctor.about}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Ratings & Experience Meta */}
        <div className="py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 font-semibold text-[#0F172A]">
            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
            <span>{doctor.rating}</span>
            <span className="text-slate-400 font-normal">({doctor.reviewsCount})</span>
          </div>
          <div className="flex items-center gap-1 text-[#64748B]">
            <Clock className="h-3.5 w-3.5" />
            <span>{doctor.experienceYears} yrs exp</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-[#64748B]">
          <span className="flex items-center gap-1 truncate max-w-[170px]">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span className="truncate">{doctor.location}</span>
          </span>
          <span className="font-bold text-[#0F172A] shrink-0">
            {formatCurrency(doctor.consultationFee)}
          </span>
        </div>

        <Button
          variant="primary"
          size="sm"
          className="w-full justify-between mt-2"
          onClick={() => onSelect(doctor)}
          rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
        >
          Book Consultation
        </Button>
      </CardContent>
    </Card>
  );
};
