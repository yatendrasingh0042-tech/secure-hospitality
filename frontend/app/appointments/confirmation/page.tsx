"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Calendar, Building2, User, ShieldCheck } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function ConfirmationPage() {
  const confirmationNumber = "APT-94820";

  return (
    <div className="py-12 lg:py-20 bg-[#F8FAFC] min-h-screen">
      <PageContainer>
        <div className="max-w-xl mx-auto space-y-6">
          {/* Animated Check Success Card */}
          <Card radius="xl" className="p-8 bg-white border border-[#E2E8F0] shadow-md text-center space-y-6">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="h-20 w-20 rounded-full bg-emerald-100 text-[#10B981] flex items-center justify-center mx-auto"
            >
              <CheckCircle2 className="h-10 w-10" />
            </motion.div>

            <div className="space-y-2">
              <Badge variant="success" size="sm" showDot>
                Demo Confirmation
              </Badge>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                Appointment Confirmed
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                Your consultation has been successfully scheduled in your digital healthcare calendar.
              </p>
            </div>

            {/* Reference Ticket Container */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-3 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-[#64748B]">Booking Reference:</span>
                <span className="font-mono font-bold text-sm text-[#2563EB]">{confirmationNumber}</span>
              </div>

              <div className="space-y-2 text-[#0F172A]">
                <div className="flex items-start gap-2.5">
                  <User className="h-4 w-4 text-[#2563EB] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Dr. Ananya Sharma</p>
                    <p className="text-[#64748B]">Senior Cardiologist · In-Person Visit</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Calendar className="h-4 w-4 text-[#2563EB] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Friday, August 14, 2026</p>
                    <p className="text-[#64748B]">10:30 AM (Local Time)</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Building2 className="h-4 w-4 text-[#2563EB] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">SecureCare Super Specialty Hospital</p>
                    <p className="text-[#64748B]">Central District · OPD Block B</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Disclaimer banner */}
            <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-[11px] text-[#2563EB] flex items-center gap-2 text-left">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>This is a frontend demonstration state. No real medical booking or financial transaction was executed.</span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:flex-1"
                asChild
              >
                <Link href="/">Back to Home</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:flex-1"
                asChild
              >
                <Link href="/doctors">Find Another Doctor</Link>
              </Button>
            </div>
          </Card>
        </div>
      </PageContainer>
    </div>
  );
}
