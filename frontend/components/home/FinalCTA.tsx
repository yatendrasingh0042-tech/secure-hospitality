"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PageContainer } from "@/components/layout/PageContainer";

interface FinalCTAProps {
  onOpenEmergencyModal?: () => void;
  onScrollToDoctors?: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({
  onOpenEmergencyModal,
  onScrollToDoctors,
}) => {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 to-blue-50/50 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <PageContainer>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-3xl p-8 sm:p-14 border border-blue-200/80 shadow-2xl text-center space-y-6 max-w-4xl mx-auto relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 text-[#2563EB] text-xs font-semibold">
            <ShieldCheck className="h-4 w-4" />
            <span>Secure Hospitality Platform</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight">
            Your healthcare journey, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] bg-clip-text text-transparent">
              all in one place.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-[#64748B] max-w-xl mx-auto leading-relaxed">
            Start managing your appointments, medicines, hospital lookups, and emergency support more simply today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            {onScrollToDoctors ? (
              <Button
                variant="primary"
                size="lg"
                onClick={onScrollToDoctors}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Get Started
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                asChild
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                <Link href="/doctors">Get Started</Link>
              </Button>
            )}

            {onOpenEmergencyModal ? (
              <Button
                variant="danger"
                size="lg"
                onClick={onOpenEmergencyModal}
                leftIcon={<PhoneCall className="h-4 w-4" />}
              >
                Emergency Support
              </Button>
            ) : (
              <Button
                variant="danger"
                size="lg"
                asChild
                leftIcon={<PhoneCall className="h-4 w-4" />}
              >
                <Link href="/emergency">Emergency Support</Link>
              </Button>
            )}
          </div>

          <p className="text-xs text-[#64748B] pt-2">
            No registration fees · 24/7 Accessible Healthcare
          </p>
        </motion.div>
      </PageContainer>
    </section>
  );
};
