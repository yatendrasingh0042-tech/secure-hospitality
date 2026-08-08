"use client";

import React from "react";
import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { UserCheck, Building2, ArrowRight, ShieldCheck, Clock, CheckCircle2 } from "lucide-react";

export default function AppointmentsOverviewPage() {
  return (
    <div className="py-12 lg:py-20 bg-[#F8FAFC] min-h-screen">
      <PageContainer>
        {/* Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <Badge variant="info" size="md" showDot>
            Digital Appointment Portal
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight">
            Book a healthcare appointment
          </h1>
          <p className="text-base sm:text-lg text-[#64748B] leading-relaxed">
            Choose a doctor or healthcare facility and find a convenient time. Fast, accessible, and 100% confidential.
          </p>
        </div>

        {/* Entry Options Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* Card 1: Find a Doctor */}
          <Card variant="interactive" radius="xl" className="p-8 border border-[#E2E8F0] hover:border-blue-200 flex flex-col justify-between">
            <CardHeader className="p-0 mb-6 space-y-3">
              <div className="h-14 w-14 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center border border-blue-100">
                <UserCheck className="h-7 w-7" />
              </div>
              <CardTitle className="text-2xl font-bold text-[#0F172A]">
                Book by Doctor
              </CardTitle>
              <CardDescription className="text-sm text-[#64748B] leading-relaxed">
                Explore top-rated cardiologists, neurologists, pediatricians, and general physicians for virtual or clinic visits.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 pt-4 border-t border-slate-100">
              <Button
                variant="primary"
                size="lg"
                className="w-full justify-between"
                asChild
              >
                <Link href="/appointments/book">
                  <span>Start Doctor Booking</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Card 2: Find a Hospital */}
          <Card variant="interactive" radius="xl" className="p-8 border border-[#E2E8F0] hover:border-indigo-200 flex flex-col justify-between">
            <CardHeader className="p-0 mb-6 space-y-3">
              <div className="h-14 w-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                <Building2 className="h-7 w-7" />
              </div>
              <CardTitle className="text-2xl font-bold text-[#0F172A]">
                Book by Hospital Facility
              </CardTitle>
              <CardDescription className="text-sm text-[#64748B] leading-relaxed">
                Find accredited trauma centers and specialty hospitals, check bed availability, and book outpatient consultation slots.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                size="lg"
                className="w-full justify-between border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                asChild
              >
                <Link href="/hospitals">
                  <span>Browse Hospitals</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Trust & Guarantee Banner */}
        <div className="max-w-4xl mx-auto p-6 rounded-3xl bg-white border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-[#64748B]">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-[#2563EB] shrink-0" />
            <span>Encrypted patient data & privacy protected</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-[#10B981] shrink-0" />
            <span>Instant booking confirmation</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-indigo-600 shrink-0" />
            <span>Zero booking or platform fees</span>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
