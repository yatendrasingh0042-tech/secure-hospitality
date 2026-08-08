"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, ArrowRight, CheckCircle2 } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { PageContainer } from "@/components/layout/PageContainer";
import { DoctorCard } from "./DoctorCard";
import { DOCTORS_DATA, Doctor } from "@/data/doctors";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export const DoctorPreview: React.FC = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [bookedStatus, setBookedStatus] = useState<boolean>(false);

  const handleBooking = () => {
    setBookedStatus(true);
    setTimeout(() => {
      setBookedStatus(false);
      setSelectedDoctor(null);
    }, 2000);
  };

  return (
    <section id="doctors" className="py-16 sm:py-24 bg-[#F8FAFC] border-b border-slate-200/70">
      <PageContainer>
        <SectionHeading
          eyebrow="Specialist Network"
          heading="Find the right doctor"
          description="Connect with top-rated medical specialists across clinical domains for virtual or in-person visits."
          action={
            <Button
              variant="outline"
              size="md"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              View All Doctors
            </Button>
          }
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {DOCTORS_DATA.map((doctor) => (
            <motion.div key={doctor.id} variants={fadeInUp}>
              <DoctorCard doctor={doctor} onSelect={(doc) => setSelectedDoctor(doc)} />
            </motion.div>
          ))}
        </motion.div>
      </PageContainer>

      {/* Doctor Profile / Consultation Modal */}
      <AnimatePresence>
        {selectedDoctor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDoctor(null)}
              className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs"
              aria-hidden="true"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 z-10 space-y-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-14 w-14 rounded-2xl ${selectedDoctor.avatarColor} text-white font-bold text-xl flex items-center justify-center`}>
                    {selectedDoctor.initials}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#0F172A]">{selectedDoctor.name}</h3>
                    <p className="text-xs font-semibold text-[#2563EB]">{selectedDoctor.specialty || selectedDoctor.specialization}</p>
                    <div className="flex items-center gap-1.5 text-xs text-[#64748B] mt-1">
                      <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                      <span className="font-semibold text-[#0F172A]">{selectedDoctor.rating}</span>
                      <span>({selectedDoctor.reviewsCount} reviews)</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedDoctor(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3 pt-2 text-xs text-[#64748B]">
                <p className="text-slate-700 leading-relaxed">{selectedDoctor.about}</p>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1.5">
                  <div className="flex justify-between">
                    <span>Experience:</span>
                    <span className="font-semibold text-[#0F172A]">{selectedDoctor.experienceYears} Years</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Facility Location:</span>
                    <span className="font-semibold text-[#0F172A]">{selectedDoctor.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Consultation Fee:</span>
                    <span className="font-bold text-[#2563EB]">{selectedDoctor.consultFee || `$${selectedDoctor.consultationFee}`}</span>
                  </div>
                </div>
              </div>

              {bookedStatus ? (
                <div className="py-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs text-emerald-800 font-semibold flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                  <span>Consultation Request Simulated!</span>
                </div>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full justify-center"
                  onClick={handleBooking}
                >
                  Confirm Appointment Booking
                </Button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
