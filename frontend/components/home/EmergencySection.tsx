"use client";

import React from "react";
import { motion } from "framer-motion";
import { Siren, PhoneCall, MapPin, ShieldCheck, Ambulance, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PageContainer } from "@/components/layout/PageContainer";

interface EmergencySectionProps {
  onOpenEmergencyModal: () => void;
}

export const EmergencySection: React.FC<EmergencySectionProps> = ({ onOpenEmergencyModal }) => {
  return (
    <section id="emergency" className="py-16 sm:py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Subtle Red Accent Glow */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="relative z-10 bg-slate-850 border border-red-900/60 rounded-3xl p-8 sm:p-12 shadow-2xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <Badge variant="danger" size="md" showDot>
                  24/7 Emergency Protocol
                </Badge>
                <span className="text-xs text-red-300 font-mono">SOS Line: 102 / 911</span>
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
                  <Siren className="h-8 w-8 text-[#EF4444] animate-pulse" /> Emergency Assistance
                </h2>
                <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
                  Need urgent medical assistance? Access emergency support quickly with location-based dispatch and instant medical triage.
                </p>
              </div>

              {/* Bullet Features List */}
              <ul className="space-y-3 pt-2 text-sm text-slate-300">
                <li className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-lg bg-red-950/80 border border-red-800 text-[#EF4444] flex items-center justify-center shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <span>Location-based emergency responder dispatch</span>
                </li>

                <li className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-lg bg-red-950/80 border border-red-800 text-[#EF4444] flex items-center justify-center shrink-0">
                    <PhoneCall className="h-4 w-4" />
                  </div>
                  <span>Direct emergency contact support & trauma counseling</span>
                </li>

                <li className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-lg bg-red-950/80 border border-red-800 text-[#EF4444] flex items-center justify-center shrink-0">
                    <Ambulance className="h-4 w-4" />
                  </div>
                  <span>One-click ambulance request & live facility routing interface</span>
                </li>
              </ul>

              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Button
                  variant="danger"
                  size="lg"
                  onClick={onOpenEmergencyModal}
                  leftIcon={<PhoneCall className="h-4 w-4" />}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Get Emergency Help
                </Button>
                <p className="text-xs text-slate-400">
                  Instant response hotline · 100% Free emergency triage
                </p>
              </div>
            </div>

            {/* Right Card Visual */}
            <div className="lg:col-span-5">
              <div className="bg-slate-950/90 border border-red-900/80 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#EF4444] animate-ping" /> Emergency Status
                  </span>
                  <span className="text-xs text-slate-400 font-mono">STANDBY READY</span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Trauma Centers Near You</span>
                    <span className="font-bold text-white">4 Available</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">ICU Emergency Beds</span>
                    <span className="font-bold text-emerald-400">38 Beds Open</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Average SOS Response Time</span>
                    <span className="font-bold text-amber-400">Sub-5 Mins</span>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1.5 justify-center">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Verified Medical Responders Network</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </PageContainer>
    </section>
  );
};
