"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface UpcomingAppointmentProps {
  hasAppointment?: boolean;
}

export const UpcomingAppointment: React.FC<UpcomingAppointmentProps> = ({
  hasAppointment = true,
}) => {
  if (!hasAppointment) {
    return (
      <Card radius="xl" className="p-6 bg-white border border-[#E2E8F0] space-y-4 text-center">
        <div className="h-12 w-12 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto">
          <Calendar className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-base text-[#0F172A]">No Upcoming Appointments</h4>
          <p className="text-xs text-[#64748B]">Book your next medical consultation with top specialists.</p>
        </div>
        <Button variant="primary" size="sm" asChild>
          <Link href="/doctors">Find a Doctor</Link>
        </Button>
      </Card>
    );
  }

  return (
    <Card radius="xl" className="p-6 bg-white border border-[#E2E8F0] space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-base text-[#0F172A] flex items-center gap-2">
          <Calendar className="h-5 w-5 text-[#2563EB]" /> Next Scheduled Appointment
        </h3>
        <Badge variant="info" size="sm" showDot>
          Confirmed
        </Badge>
      </div>

      <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-[#2563EB] text-white font-extrabold text-base flex items-center justify-center shrink-0">
            AS
          </div>
          <div>
            <h4 className="font-bold text-base text-[#0F172A]">Dr. Ananya Sharma</h4>
            <p className="text-xs font-semibold text-[#2563EB]">Senior Cardiologist · MBBS, MD</p>
            <p className="text-xs text-[#64748B] flex items-center gap-1 mt-0.5">
              <MapPin className="h-3.5 w-3.5 text-slate-400" /> City Care Hospital, Room 402
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right space-y-1 shrink-0 border-t sm:border-t-0 border-blue-200/80 pt-2 sm:pt-0 w-full sm:w-auto">
          <span className="text-xs font-extrabold text-[#0F172A] block">Tuesday, Aug 12</span>
          <span className="text-xs font-semibold text-[#2563EB] flex items-center gap-1 sm:justify-end">
            <Clock className="h-3.5 w-3.5" /> 10:30 AM (In-Person)
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-slate-400">Token ID: #APT-94820</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/appointments">Manage Booking</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};
