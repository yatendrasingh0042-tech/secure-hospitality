"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronRight,
  Star,
  Clock,
  Building2,
  Calendar,
  CheckCircle2,
  Award,
  Globe,
  ArrowRight,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { DOCTORS_DATA } from "@/data/doctors";

export default function DoctorDetailPage() {
  const params = useParams();
  const doctorId = params.id as string;

  const doctor = DOCTORS_DATA.find((d) => d.id === doctorId);

  // Default slots fallback
  const availableSlots = doctor?.availableSlots || [
    {
      day: "Today",
      slots: [
        { time: "10:00 AM", available: true },
        { time: "10:30 AM", available: true },
        { time: "11:30 AM", available: false },
        { time: "02:00 PM", available: true },
        { time: "04:30 PM", available: true },
      ],
    },
    {
      day: "Tomorrow",
      slots: [
        { time: "09:30 AM", available: true },
        { time: "11:00 AM", available: true },
        { time: "03:00 PM", available: true },
      ],
    },
  ];

  const [selectedDay, setSelectedDay] = useState(availableSlots[0].day);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  if (!doctor) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-[#0F172A]">Doctor Profile Not Found</h2>
        <p className="text-sm text-[#64748B]">The requested doctor profile does not exist in our directory.</p>
        <Button variant="primary" size="md" asChild>
          <Link href="/doctors">Back to Doctors Directory</Link>
        </Button>
      </div>
    );
  }

  const activeDayObj = availableSlots.find((s) => s.day === selectedDay) || availableSlots[0];

  return (
    <div className="py-8 lg:py-14 bg-[#F8FAFC] min-h-screen">
      <PageContainer>
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#64748B] mb-6 overflow-x-auto" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#0F172A] transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <Link href="/doctors" className="hover:text-[#0F172A] transition-colors">
            Doctors
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <span className="font-semibold text-[#0F172A] truncate">{doctor.name}</span>
        </nav>

        {/* Profile Hero Header Card */}
        <Card variant="elevated" radius="xl" className="p-6 sm:p-8 bg-white border border-[#E2E8F0] mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className={`h-20 w-20 sm:h-24 sm:w-24 rounded-3xl ${doctor.avatarColor} text-white font-bold text-3xl flex items-center justify-center shadow-lg shrink-0`}>
                {doctor.initials}
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                    {doctor.name}
                  </h1>
                  <Badge variant={doctor.availability === "Available Today" ? "success" : "neutral"} size="sm" showDot>
                    {doctor.availability}
                  </Badge>
                </div>
                <p className="text-sm font-semibold text-[#2563EB]">
                  {doctor.specialization} — {doctor.subSpecialization}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#64748B] pt-1">
                  <span className="flex items-center gap-1 font-semibold text-[#0F172A]">
                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                    <span>{doctor.rating}</span> ({doctor.reviewsCount} reviews)
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {doctor.experienceYears}+ years experience
                  </span>
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5" /> {doctor.hospital}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-2 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
              <div className="text-left md:text-right">
                <span className="text-xs text-[#64748B]">Consultation Fee</span>
                <p className="text-2xl font-extrabold text-[#0F172A]">${doctor.consultationFee}</p>
              </div>
              <Button
                variant="primary"
                size="lg"
                className="w-full md:w-auto"
                onClick={() => setIsBookingModalOpen(true)}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Book Appointment
              </Button>
            </div>
          </div>
        </Card>

        {/* Main Content Layout Grid: Profile Info & Booking Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Details */}
          <div className="lg:col-span-8 space-y-6">
            {/* About Section */}
            <Card radius="xl" className="p-6 bg-white border border-[#E2E8F0] space-y-3">
              <h2 className="text-lg font-bold text-[#0F172A]">About {doctor.name}</h2>
              <p className="text-sm text-[#64748B] leading-relaxed">{doctor.about}</p>
            </Card>

            {/* Specialization & Services */}
            <Card radius="xl" className="p-6 bg-white border border-[#E2E8F0] space-y-4">
              <h2 className="text-lg font-bold text-[#0F172A]">Services & Clinical Expertise</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {doctor.services.map((srv) => (
                  <div key={srv} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-[#0F172A]">
                    <CheckCircle2 className="h-4 w-4 text-[#10B981] shrink-0" />
                    <span>{srv}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Experience & Education */}
            <Card radius="xl" className="p-6 bg-white border border-[#E2E8F0] space-y-4">
              <h2 className="text-lg font-bold text-[#0F172A]">Education & Credentials</h2>
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                    <Award className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-[#0F172A]">Education</p>
                    <p className="text-[#64748B]">{doctor.education}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-xl bg-emerald-50 text-[#10B981] flex items-center justify-center shrink-0">
                    <Globe className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-[#0F172A]">Spoken Languages</p>
                    <p className="text-[#64748B]">{doctor.languages.join(", ")}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Time Slot Selection & Hospital Panel */}
          <div className="lg:col-span-4 space-y-6">
            <Card radius="xl" className="p-6 bg-white border border-[#E2E8F0] space-y-5 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-base text-[#0F172A] flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#2563EB]" /> Select Time Slot
                </h3>
                <Badge variant="info" size="sm">
                  Virtual / Clinic
                </Badge>
              </div>

              {/* Day Tabs */}
              <div className="flex items-center gap-2">
                {availableSlots.map((slotGroup) => (
                  <button
                    key={slotGroup.day}
                    type="button"
                    onClick={() => {
                      setSelectedDay(slotGroup.day);
                      setSelectedTime(null);
                    }}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                      selectedDay === slotGroup.day
                        ? "bg-[#2563EB] text-white shadow-2xs"
                        : "bg-slate-100 text-[#64748B] hover:bg-slate-200"
                    }`}
                  >
                    {slotGroup.day}
                  </button>
                ))}
              </div>

              {/* Time Slots Grid */}
              <div className="space-y-2">
                <p className="text-xs text-[#64748B] font-medium">Available Consultation Slots:</p>
                <div className="grid grid-cols-2 gap-2">
                  {activeDayObj.slots.map((s) => (
                    <button
                      key={s.time}
                      type="button"
                      disabled={!s.available}
                      onClick={() => setSelectedTime(s.time)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                        !s.available
                          ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed line-through"
                          : selectedTime === s.time
                          ? "bg-blue-50 border-[#2563EB] text-[#2563EB] ring-2 ring-[#2563EB]"
                          : "bg-white border-slate-200 text-[#0F172A] hover:border-blue-200"
                      }`}
                    >
                      {s.time}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full justify-center"
                disabled={!selectedTime}
                onClick={() => setIsBookingModalOpen(true)}
              >
                {selectedTime ? `Book Slot for ${selectedTime}` : "Select a Time Slot"}
              </Button>
            </Card>
          </div>
        </div>
      </PageContainer>

      {/* Mobile Sticky Booking Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 z-40 flex items-center justify-between shadow-2xl">
        <div>
          <p className="text-xs text-[#64748B]">Consultation Fee</p>
          <p className="text-lg font-bold text-[#0F172A]">${doctor.consultationFee}</p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => setIsBookingModalOpen(true)}
          rightIcon={<ArrowRight className="h-4 w-4" />}
        >
          Book Appointment
        </Button>
      </div>

      {/* Simulated Booking Modal */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBookingModalOpen(false)}
              className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs"
              aria-hidden="true"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 z-10 space-y-5"
            >
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-xl ${doctor.avatarColor} text-white font-bold text-sm flex items-center justify-center`}>
                    {doctor.initials}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#0F172A]">Confirm Appointment</h3>
                    <p className="text-xs text-[#2563EB]">{doctor.name}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Specialty:</span>
                  <span className="font-semibold text-[#0F172A]">{doctor.specialization}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Selected Slot:</span>
                  <span className="font-semibold text-[#2563EB]">{selectedDay} at {selectedTime || "10:00 AM"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Facility Location:</span>
                  <span className="font-semibold text-[#0F172A]">{doctor.hospital}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 text-sm">
                  <span className="font-bold text-[#0F172A]">Total Consultation Fee:</span>
                  <span className="font-extrabold text-[#2563EB]">${doctor.consultationFee}</span>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full justify-center"
                asChild
              >
                <Link href={`/appointments/book?doctorId=${doctor.id}`}>
                  Proceed to Complete Booking ({selectedDay} {selectedTime || "10:00 AM"})
                </Link>
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
