"use client";

import React from "react";
import { Doctor } from "@/types/doctor";
import { Hospital } from "@/types/hospital";
import { AppointmentType, PatientInfo } from "@/context/AppointmentContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Calendar, Clock, User, Video, MapPin, Building2, ShieldCheck } from "lucide-react";
import { formatCurrency } from "@/lib/formatCurrency";
import { getAppointmentPrice } from "@/lib/pricing/appointmentPricing";

interface AppointmentSummaryProps {
  doctor: Doctor | null;
  hospital: Hospital | null;
  appointmentType: AppointmentType;
  selectedDate: string;
  selectedTime: string;
  patientInfo: PatientInfo;
}

export const AppointmentSummary: React.FC<AppointmentSummaryProps> = ({
  doctor,
  hospital,
  appointmentType,
  selectedDate,
  selectedTime,
  patientInfo,
}) => {
  const typeLabels = {
    in_person: "In-Person Clinic Visit",
    video: "Online Video Consultation",
    follow_up: "Follow-Up Consultation",
  };

  const fee = doctor ? getAppointmentPrice(doctor, appointmentType) : 500;

  return (
    <Card radius="xl" className="p-6 bg-white border border-[#E2E8F0] space-y-5 sticky top-24 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="font-bold text-base text-[#0F172A] flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-[#2563EB]" /> Appointment Summary
        </h3>
        <Badge variant="info" size="sm">
          Frontend Mock
        </Badge>
      </div>

      {/* Provider Details */}
      {doctor ? (
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-blue-50/70 border border-blue-100">
          <div className={`h-12 w-12 rounded-xl ${doctor.avatarColor} text-white font-bold flex items-center justify-center text-sm shrink-0`}>
            {doctor.initials}
          </div>
          <div className="truncate">
            <h4 className="font-bold text-sm text-[#0F172A] truncate">{doctor.name}</h4>
            <p className="text-xs text-[#2563EB] font-medium truncate">{doctor.specialization}</p>
            <p className="text-[11px] text-[#64748B] flex items-center gap-1 truncate mt-0.5">
              <Building2 className="h-3 w-3 shrink-0 text-slate-400" />
              <span className="truncate">{doctor.hospital}</span>
            </p>
          </div>
        </div>
      ) : hospital ? (
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100">
          <div className="h-12 w-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
            <Building2 className="h-6 w-6" />
          </div>
          <div className="truncate">
            <h4 className="font-bold text-sm text-[#0F172A] truncate">{hospital.name}</h4>
            <p className="text-xs text-indigo-600 font-medium truncate">{hospital.type}</p>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-400">
          No provider selected yet
        </div>
      )}

      {/* Booking Specs List */}
      <div className="space-y-2.5 text-xs text-[#0F172A]">
        <div className="flex items-center justify-between py-1 border-b border-slate-100">
          <span className="text-[#64748B] flex items-center gap-1.5">
            {appointmentType === "video" ? <Video className="h-3.5 w-3.5 text-[#2563EB]" /> : <MapPin className="h-3.5 w-3.5 text-[#2563EB]" />}
            Consultation Type
          </span>
          <span className="font-semibold">{typeLabels[appointmentType]}</span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-slate-100">
          <span className="text-[#64748B] flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-[#2563EB]" /> Chosen Date
          </span>
          <span className="font-semibold">{selectedDate || "Not selected"}</span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-slate-100">
          <span className="text-[#64748B] flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-[#2563EB]" /> Chosen Time
          </span>
          <span className="font-semibold">{selectedTime || "Not selected"}</span>
        </div>

        {patientInfo.fullName && (
          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <span className="text-[#64748B] flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-[#2563EB]" /> Patient
            </span>
            <span className="font-semibold truncate max-w-[150px]">{patientInfo.fullName}</span>
          </div>
        )}
      </div>

      {/* Fee Calculation */}
      <div className="pt-2 border-t border-slate-200 space-y-1">
        <div className="flex justify-between items-center text-xs text-[#64748B]">
          <span>Consultation Fee</span>
          <span>{formatCurrency(fee)}</span>
        </div>
        <div className="flex justify-between items-center text-xs text-[#64748B]">
          <span>Service & Tech Fee</span>
          <span className="text-emerald-600 font-semibold">Free</span>
        </div>
        <div className="flex justify-between items-center pt-2 text-sm font-extrabold text-[#0F172A]">
          <span>Total Estimated Fee</span>
          <span className="text-base text-[#2563EB]">{formatCurrency(fee)}</span>
        </div>
      </div>
    </Card>
  );
};
