"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, PackageCheck, Truck, ShieldCheck } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function OrderConfirmationPage() {
  const orderNumber = "SH-2026-001";

  return (
    <div className="py-12 lg:py-20 bg-[#F8FAFC] min-h-screen">
      <PageContainer>
        <div className="max-w-xl mx-auto space-y-6">
          {/* Animated Success Card */}
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
                Demo Order Placed
              </Badge>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                Order Confirmed
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                Your healthcare essentials order has been placed in our simulated dispatch pipeline.
              </p>
            </div>

            {/* Reference Ticket Container */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-3 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-[#64748B]">Order Reference Number:</span>
                <span className="font-mono font-bold text-sm text-[#2563EB]">{orderNumber}</span>
              </div>

              <div className="space-y-2 text-[#0F172A]">
                <div className="flex items-start gap-2.5">
                  <PackageCheck className="h-4 w-4 text-[#2563EB] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Healthcare Products Order</p>
                    <p className="text-[#64748B]">Dispatching from Central Logistics Hub</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Truck className="h-4 w-4 text-[#2563EB] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Estimated Delivery: 2–3 Business Days</p>
                    <p className="text-[#64748B]">Doorstep delivery tracking code assigned</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Safe Prototype notice */}
            <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-[11px] text-[#2563EB] flex items-center gap-2 text-left">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>This is a frontend demonstration state. No real transaction or physical dispatch will occur.</span>
            </div>

            {/* Action CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:flex-1"
                asChild
              >
                <Link href="/medicines">Continue Shopping</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:flex-1"
                asChild
              >
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </Card>
        </div>
      </PageContainer>
    </div>
  );
}
