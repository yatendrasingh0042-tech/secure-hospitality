"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Siren, MapPin, Phone, ShieldAlert, CheckCircle2 } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmergencyProviderContext, useEmergency } from "@/context/EmergencyContext";

function ConfirmContent() {
  const router = useRouter();
  const { assistanceType, location, emergencyContact, confirmRequest } = useEmergency();

  const handleFinalConfirm = () => {
    confirmRequest();
    router.push("/emergency/status");
  };

  const typeLabels = {
    ambulance: "ALS Ambulance Dispatch Assistance",
    hospital_guidance: "24/7 ER Hospital Guidance",
    contacts: "Emergency Contacts Notification",
  };

  return (
    <div className="py-8 lg:py-14 bg-[#F8FAFC] min-h-screen">
      <PageContainer>
        <div className="max-w-xl mx-auto space-y-6">
          {/* Navigation Link */}
          <Link
            href="/emergency"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Emergency Hub
          </Link>

          <Card radius="xl" className="p-6 sm:p-8 bg-white border border-[#E2E8F0] shadow-md space-y-6">
            <div className="space-y-1">
              <Badge variant="danger" size="sm" showDot>
                Safety Confirmation
              </Badge>
              <h1 className="text-2xl font-bold text-[#0F172A]">Confirm Emergency Assistance</h1>
              <p className="text-xs text-[#64748B]">Please review your location and request details before confirming.</p>
            </div>

            {/* Request Details Review Grid */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-[#64748B] flex items-center gap-1.5">
                  <Siren className="h-4 w-4 text-[#EF4444]" /> Requested Assistance
                </span>
                <span className="font-bold text-[#0F172A] text-right">{typeLabels[assistanceType]}</span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-[#64748B] flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-[#2563EB]" /> Confirmed Location
                </span>
                <span className="font-bold text-[#0F172A] text-right">{location.name}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#64748B] flex items-center gap-1.5">
                  <Phone className="h-4 w-4 text-[#10B981]" /> Contact Person
                </span>
                <span className="font-bold text-[#0F172A] text-right">{emergencyContact.name} ({emergencyContact.phone})</span>
              </div>
            </div>

            {/* Mandatory Safety Notice */}
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-[#EF4444] space-y-1.5">
              <div className="flex items-center gap-2 font-bold">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>Important Prototype Notice</span>
              </div>
              <p className="text-[11px] leading-relaxed text-red-700">
                Emergency services may require direct contact with local emergency dispatchers. <strong>This demo does not dispatch a real ambulance or contact emergency 911/108 services.</strong>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Button variant="outline" size="md" className="w-full sm:flex-1" asChild>
                <Link href="/emergency">Back</Link>
              </Button>
              <Button
                variant="danger"
                size="md"
                className="w-full sm:flex-1 bg-[#EF4444] text-white hover:bg-red-700"
                onClick={handleFinalConfirm}
                rightIcon={<CheckCircle2 className="h-4 w-4" />}
              >
                Confirm Request
              </Button>
            </div>
          </Card>
        </div>
      </PageContainer>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <EmergencyProviderContext>
      <Suspense fallback={<div className="py-20 text-center text-sm text-slate-500">Loading Confirmation...</div>}>
        <ConfirmContent />
      </Suspense>
    </EmergencyProviderContext>
  );
}
