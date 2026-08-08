"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, MapPin, Check, X } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { PageContainer } from "@/components/layout/PageContainer";
import { HospitalCard } from "./HospitalCard";
import { HOSPITALS_DATA, Hospital } from "@/data/hospitals";

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

export const HospitalPreview: React.FC = () => {
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  return (
    <section id="hospitals" className="py-16 sm:py-24 bg-[#F8FAFC] border-b border-slate-200/70">
      <PageContainer>
        <SectionHeading
          eyebrow="Healthcare Network"
          heading="Find healthcare near you."
          description="Discover accredited medical centers, check real-time bed availability, and access emergency trauma units."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {HOSPITALS_DATA.map((hospital) => (
            <motion.div key={hospital.id} variants={fadeInUp}>
              <HospitalCard
                hospital={hospital}
                onSelect={(hosp) => setSelectedHospital(hosp)}
              />
            </motion.div>
          ))}
        </motion.div>
      </PageContainer>

      {/* Hospital Detail Modal */}
      <AnimatePresence>
        {selectedHospital && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedHospital(null)}
              className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs"
              aria-hidden="true"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 z-10 space-y-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#0F172A]">{selectedHospital.name}</h3>
                    <p className="text-xs font-semibold text-indigo-600">{selectedHospital.type}</p>
                    <p className="text-xs text-[#64748B] flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span>{selectedHospital.location} ({selectedHospital.distanceKm} km away)</span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedHospital(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
                  <p className="text-slate-500 font-medium">Available ICU Beds</p>
                  <p className="text-lg font-bold text-[#10B981] mt-0.5">{selectedHospital.icuBedsAvailable}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-center">
                  <p className="text-slate-500 font-medium">General Wards</p>
                  <p className="text-lg font-bold text-[#2563EB] mt-0.5">{selectedHospital.generalBedsAvailable}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-2">
                  Specialized Infrastructure & Features
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
                  {(selectedHospital.features || selectedHospital.facilities).map((feat: string) => (
                    <div key={feat} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#10B981]" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs">
                  <p className="text-slate-500">Emergency Desk Phone:</p>
                  <p className="font-bold text-[#EF4444]">{selectedHospital.emergencyPhone}</p>
                </div>
                <Button variant="primary" size="md" onClick={() => setSelectedHospital(null)}>
                  Close Facility View
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
