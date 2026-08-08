"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Video,
  MapPin,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { AppointmentStepper } from "@/components/appointments/AppointmentStepper";
import { AppointmentSummary } from "@/components/appointments/AppointmentSummary";
import { DateSelector } from "@/components/appointments/DateSelector";
import { TimeSlotSelector } from "@/components/appointments/TimeSlotSelector";
import { PatientForm } from "@/components/appointments/PatientForm";
import { AppointmentProvider, useAppointment } from "@/context/AppointmentContext";
import { DOCTORS_DATA } from "@/data/doctors";
import { HOSPITALS_DATA } from "@/data/hospitals";

function BookingEngineContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorIdParam = searchParams.get("doctorId");
  const hospitalIdParam = searchParams.get("hospitalId");

  const {
    selectedDoctor,
    selectedHospital,
    appointmentType,
    selectedDate,
    selectedTime,
    patientInformation,
    currentStep,
    setDoctor,
    setHospital,
    setAppointmentType,
    setSelectedDate,
    setSelectedTime,
    setPatientInfo,
    goToStep,
    nextStep,
    prevStep,
  } = useAppointment();

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-select doctor or hospital from URL parameters on mount
  useEffect(() => {
    if (doctorIdParam && !selectedDoctor) {
      const doc = DOCTORS_DATA.find((d) => d.id === doctorIdParam);
      if (doc) setDoctor(doc);
    } else if (hospitalIdParam && !selectedHospital) {
      const hosp = HOSPITALS_DATA.find((h) => h.id === hospitalIdParam);
      if (hosp) setHospital(hosp);
    }
  }, [doctorIdParam, hospitalIdParam, selectedDoctor, selectedHospital, setDoctor, setHospital]);

  // Form validation logic for Step 4
  const validatePatientForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!patientInformation.fullName.trim()) {
      errors.fullName = "Full name is required";
    }
    if (!patientInformation.age || Number(patientInformation.age) <= 0) {
      errors.age = "Please enter a valid age";
    }
    if (!patientInformation.phone.trim() || patientInformation.phone.length < 7) {
      errors.phone = "Valid phone number is required";
    }
    if (
      !patientInformation.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patientInformation.email)
    ) {
      errors.email = "Valid email address is required";
    }
    if (!patientInformation.reason.trim()) {
      errors.reason = "Reason for visit is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!selectedDoctor && !selectedHospital) return;
      nextStep();
    } else if (currentStep === 2) {
      nextStep();
    } else if (currentStep === 3) {
      if (!selectedTime) return;
      nextStep();
    } else if (currentStep === 4) {
      if (validatePatientForm()) {
        nextStep();
      }
    } else if (currentStep === 5) {
      // Confirm Appointment Simulation
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        router.push("/appointments/confirmation");
      }, 1500);
    }
  };

  return (
    <div className="py-8 lg:py-14 bg-[#F8FAFC] min-h-screen">
      <PageContainer>
        {/* Navigation Back Link */}
        <div className="mb-6">
          <Link
            href="/appointments"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Overview
          </Link>
        </div>

        {/* 5-Step Stepper Header */}
        <AppointmentStepper currentStep={currentStep} onStepClick={goToStep} />

        {/* Multi-Step Grid Layout: Step Container + Persistent Summary Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Dynamic Step Area */}
          <main className="lg:col-span-8">
            <Card radius="xl" className="p-6 sm:p-8 bg-white border border-[#E2E8F0] shadow-sm">
              <AnimatePresence mode="wait">
                {/* STEP 1: DOCTOR / PROVIDER SELECTION */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-[#0F172A]">Step 1: Choose Healthcare Provider</h2>
                      <p className="text-xs text-[#64748B] mt-1">Select a doctor or facility for your appointment consultation.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {DOCTORS_DATA.slice(0, 6).map((doc) => {
                        const isSelected = selectedDoctor?.id === doc.id;
                        return (
                          <div
                            key={doc.id}
                            onClick={() => setDoctor(doc)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                              isSelected
                                ? "bg-blue-50/80 border-[#2563EB] ring-2 ring-[#2563EB]"
                                : "bg-white border-[#E2E8F0] hover:border-blue-200 hover:bg-slate-50"
                            }`}
                          >
                            <div className={`h-12 w-12 rounded-xl ${doc.avatarColor} text-white font-bold flex items-center justify-center shrink-0`}>
                              {doc.initials}
                            </div>
                            <div className="truncate">
                              <p className="font-bold text-sm text-[#0F172A] truncate">{doc.name}</p>
                              <p className="text-xs text-[#2563EB] font-semibold truncate">{doc.specialization}</p>
                              <p className="text-[11px] text-[#64748B] truncate mt-0.5">${doc.consultationFee} fee · {doc.experienceYears} yrs exp</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: APPOINTMENT TYPE */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-[#0F172A]">Step 2: Choose Consultation Type</h2>
                      <p className="text-xs text-[#64748B] mt-1">Select your preferred mode of medical consultation.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Option 1: In-Person */}
                      <div
                        onClick={() => setAppointmentType("in_person")}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                          appointmentType === "in_person"
                            ? "bg-blue-50/80 border-[#2563EB] ring-2 ring-[#2563EB]"
                            : "bg-white border-[#E2E8F0] hover:border-blue-200 hover:bg-slate-50"
                        }`}
                      >
                        <div className="h-10 w-10 rounded-xl bg-blue-100 text-[#2563EB] flex items-center justify-center">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-[#0F172A]">In-Person Visit</h4>
                          <p className="text-xs text-[#64748B] mt-1">Consult doctor physically at clinic or hospital facility.</p>
                        </div>
                      </div>

                      {/* Option 2: Video Call */}
                      <div
                        onClick={() => setAppointmentType("video")}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                          appointmentType === "video"
                            ? "bg-blue-50/80 border-[#2563EB] ring-2 ring-[#2563EB]"
                            : "bg-white border-[#E2E8F0] hover:border-blue-200 hover:bg-slate-50"
                        }`}
                      >
                        <div className="h-10 w-10 rounded-xl bg-emerald-100 text-[#10B981] flex items-center justify-center">
                          <Video className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-[#0F172A]">Video Consultation</h4>
                          <p className="text-xs text-[#64748B] mt-1">HD online video consultation from home.</p>
                        </div>
                      </div>

                      {/* Option 3: Follow-Up */}
                      <div
                        onClick={() => setAppointmentType("follow_up")}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                          appointmentType === "follow_up"
                            ? "bg-blue-50/80 border-[#2563EB] ring-2 ring-[#2563EB]"
                            : "bg-white border-[#E2E8F0] hover:border-blue-200 hover:bg-slate-50"
                        }`}
                      >
                        <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                          <RefreshCw className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-[#0F172A]">Follow-Up Visit</h4>
                          <p className="text-xs text-[#64748B] mt-1">Review lab results or progress after prior visit.</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: DATE & TIME SELECTION */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-8"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-[#0F172A]">Step 3: Select Date & Time</h2>
                      <p className="text-xs text-[#64748B] mt-1">Pick a convenient date and time slot for your appointment.</p>
                    </div>

                    <DateSelector
                      selectedDate={selectedDate}
                      onSelectDate={(d) => {
                        setSelectedDate(d);
                        setSelectedTime("");
                      }}
                    />

                    <TimeSlotSelector
                      selectedTime={selectedTime}
                      onSelectTime={setSelectedTime}
                    />
                  </motion.div>
                )}

                {/* STEP 4: PATIENT FORM */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-[#0F172A]">Step 4: Enter Patient Details</h2>
                      <p className="text-xs text-[#64748B] mt-1">Provide essential patient information for medical record assignment.</p>
                    </div>

                    <PatientForm
                      initialValues={patientInformation}
                      onChange={setPatientInfo}
                      errors={formErrors}
                    />
                  </motion.div>
                )}

                {/* STEP 5: REVIEW & CONFIRM */}
                {currentStep === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-[#0F172A]">Step 5: Review Appointment Details</h2>
                      <p className="text-xs text-[#64748B] mt-1">Verify all booking details before final confirmation.</p>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200">
                        <div>
                          <span className="text-[#64748B]">Selected Provider:</span>
                          <p className="font-bold text-sm text-[#0F172A] mt-0.5">
                            {selectedDoctor ? selectedDoctor.name : selectedHospital?.name}
                          </p>
                          <p className="text-[#2563EB] font-medium">
                            {selectedDoctor ? selectedDoctor.specialization : selectedHospital?.type}
                          </p>
                        </div>

                        <div>
                          <span className="text-[#64748B]">Consultation Schedule:</span>
                          <p className="font-bold text-sm text-[#0F172A] mt-0.5">
                            {selectedDate} at {selectedTime}
                          </p>
                          <p className="text-emerald-600 font-semibold capitalize">
                            {appointmentType.replace("_", " ")}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 pt-1">
                        <span className="font-bold uppercase tracking-wider text-[#0F172A]">Patient Details</span>
                        <div className="grid grid-cols-2 gap-2 text-slate-700">
                          <p><span className="text-[#64748B]">Name:</span> {patientInformation.fullName}</p>
                          <p><span className="text-[#64748B]">Age:</span> {patientInformation.age} yrs</p>
                          <p><span className="text-[#64748B]">Phone:</span> {patientInformation.phone}</p>
                          <p><span className="text-[#64748B]">Email:</span> {patientInformation.email}</p>
                        </div>
                        <p className="pt-2"><span className="text-[#64748B]">Reason for visit:</span> {patientInformation.reason}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons Bar */}
              <div className="pt-8 border-t border-slate-100 flex items-center justify-between gap-4">
                {currentStep > 1 ? (
                  <Button
                    variant="outline"
                    size="md"
                    onClick={prevStep}
                    disabled={isSubmitting}
                    leftIcon={<ArrowLeft className="h-4 w-4" />}
                  >
                    Back
                  </Button>
                ) : (
                  <div />
                )}

                <Button
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  disabled={
                    (currentStep === 1 && !selectedDoctor && !selectedHospital) ||
                    (currentStep === 3 && !selectedTime)
                  }
                  onClick={handleNext}
                  rightIcon={currentStep < 5 ? <ArrowRight className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                >
                  {currentStep === 5
                    ? isSubmitting
                      ? "Confirming appointment..."
                      : "Confirm Appointment"
                    : "Continue"}
                </Button>
              </div>
            </Card>
          </main>

          {/* Persistent Summary Sidebar */}
          <aside className="lg:col-span-4 w-full">
            <AppointmentSummary
              doctor={selectedDoctor}
              hospital={selectedHospital}
              appointmentType={appointmentType}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              patientInfo={patientInformation}
            />
          </aside>
        </div>
      </PageContainer>
    </div>
  );
}

export default function BookingPage() {
  return (
    <AppointmentProvider>
      <Suspense fallback={<div className="py-20 text-center text-sm text-[#64748B]">Loading Booking Engine...</div>}>
        <BookingEngineContent />
      </Suspense>
    </AppointmentProvider>
  );
}
