"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  PhoneCall,
  ShieldCheck,
  CheckCircle2,
  Heart,
  Activity,
  UserCheck,
  Siren,
  Clock,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PageContainer } from "@/components/layout/PageContainer";

interface HeroSectionProps {
  onOpenEmergencyModal: () => void;
  onScrollToDoctors: () => void;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenEmergencyModal,
  onScrollToDoctors,
}) => {
  return (
    <section className="relative pt-10 pb-16 lg:pt-16 lg:pb-28 overflow-hidden bg-gradient-to-b from-blue-50/60 via-slate-50 to-white border-b border-slate-200/60">
      {/* Subtle Background Glow Orbs */}
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />

      <PageContainer>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Hero Left Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="lg:col-span-7 space-y-6 sm:space-y-7 text-left"
          >
            <motion.div variants={fadeInUp}>
              <Badge variant="info" size="md" showDot>
                Unified Digital Healthcare
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F172A] tracking-tight leading-[1.12]"
            >
              Healthcare, <br />
              <span className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] bg-clip-text text-transparent">
                simplified for you.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-base sm:text-lg lg:text-xl text-[#64748B] leading-relaxed max-w-2xl"
            >
              Book appointments, discover healthcare services, manage medicines, and get emergency assistance from one trusted platform.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1"
            >
              <Button
                variant="primary"
                size="lg"
                onClick={onScrollToDoctors}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Book an Appointment
              </Button>
              <Button
                variant="danger"
                size="lg"
                onClick={onOpenEmergencyModal}
                leftIcon={<PhoneCall className="h-4 w-4" />}
              >
                Emergency Help
              </Button>
            </motion.div>

            {/* Micro-trust indicators */}
            <motion.div
              variants={fadeInUp}
              className="pt-4 flex flex-wrap items-center gap-5 text-xs sm:text-sm font-medium text-[#64748B] border-t border-slate-200/70"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                <span>Verified Doctors</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#2563EB]" />
                <span>Encrypted Patient Data</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#F59E0B]" />
                <span>24/7 Access</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Right Visual Layered Dashboard Cards */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Card */}
              <div className="glass-card rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-200/80 space-y-6 relative z-10">
                {/* Header Row */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-blue-100 flex items-center justify-center text-[#2563EB]">
                      <UserCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#0F172A]">Dr. Ananya Sharma</h4>
                      <p className="text-xs text-[#64748B]">Senior Cardiologist</p>
                    </div>
                  </div>
                  <Badge variant="success" size="sm" showDot>
                    Confirmed
                  </Badge>
                </div>

                {/* Vitals Summary Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50/90 p-3.5 rounded-2xl border border-slate-100 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-red-100 flex items-center justify-center text-[#EF4444]">
                      <Heart className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-[#64748B]">Heart Rate</p>
                      <p className="text-sm font-bold text-[#0F172A]">
                        72 <span className="text-[10px] text-slate-500 font-normal">bpm</span>
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50/90 p-3.5 rounded-2xl border border-slate-100 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-emerald-100 flex items-center justify-center text-[#10B981]">
                      <Activity className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-[#64748B]">Vitals Status</p>
                      <p className="text-sm font-bold text-[#10B981]">Optimal</p>
                    </div>
                  </div>
                </div>

                {/* Emergency Dispatch Mini Banner */}
                <button
                  type="button"
                  onClick={onOpenEmergencyModal}
                  className="w-full text-left p-3.5 rounded-2xl bg-red-50 hover:bg-red-100/80 border border-red-200/70 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-[#EF4444] text-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                      <Siren className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#0F172A]">Emergency SOS Mode</p>
                      <p className="text-[11px] text-red-600 font-medium">Click for instant dispatch</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#EF4444] bg-white px-2.5 py-1 rounded-lg border border-red-200 shadow-2xs">
                    Quick SOS
                  </span>
                </button>
              </div>

              {/* Floating Accent Badges */}
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-2 sm:-right-4 glass-card px-3.5 py-2 rounded-2xl shadow-lg border border-slate-200 text-xs font-semibold text-[#0F172A] flex items-center gap-2 z-20"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-[#10B981] animate-pulse" />
                <span>Live Hospital Bed Tracker</span>
              </motion.div>

              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -left-2 sm:-left-4 glass-card px-3.5 py-2 rounded-2xl shadow-lg border border-slate-200 text-xs font-semibold text-[#0F172A] flex items-center gap-2 z-20"
              >
                <ShieldCheck className="h-4 w-4 text-[#2563EB]" />
                <span>Secure Patient Records</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </PageContainer>
    </section>
  );
};
