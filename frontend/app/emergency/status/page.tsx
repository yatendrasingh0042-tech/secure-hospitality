"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { Siren, MapPin, Phone, ShieldAlert, XCircle, ArrowLeft } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmergencyTimeline } from "@/components/emergency/EmergencyTimeline";
import { TrackingMap } from "@/components/emergency/TrackingMap";
import { CancelRequestDialog } from "@/components/emergency/CancelRequestDialog";
import { EmergencyProviderContext, useEmergency } from "@/context/EmergencyContext";

function StatusContent() {
  const {
    status,
    requestId,
    location,
    provider,
    estimatedArrival,
    cancelRequest,
    resetEmergency,
  } = useEmergency();

  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const statusBadgeText: Record<string, string> = {
    requesting: "Connecting to Dispatch...",
    requested: "Finding Assistance Unit...",
    assigned: "Unit Assigned",
    enRoute: "En Route to Location",
    arrived: "Arrived at Location",
    completed: "Assistance Completed",
    cancelled: "Request Cancelled",
  };

  return (
    <div className="py-8 lg:py-14 bg-[#F8FAFC] min-h-screen">
      <PageContainer>
        {/* Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/emergency"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Emergency Hub
          </Link>
          <span className="font-mono text-xs text-slate-400 font-semibold">
            ID: {requestId}
          </span>
        </div>

        {/* Cancelled State View */}
        {status === "cancelled" ? (
          <div className="max-w-md mx-auto text-center space-y-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="h-16 w-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <XCircle className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-[#0F172A]">Request Cancelled</h2>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Your simulated emergency assistance request has been cancelled. No provider will be dispatched.
              </p>
            </div>
            <Button variant="primary" size="md" className="w-full" onClick={resetEmergency} asChild>
              <Link href="/emergency">Return to Emergency Hub</Link>
            </Button>
          </div>
        ) : (
          /* Active Live Tracking Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Live Map & Unit Details */}
            <main className="lg:col-span-8 space-y-6">
              {/* Header Status Card */}
              <Card radius="xl" className="p-6 bg-white border border-[#E2E8F0] shadow-sm space-y-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="space-y-1">
                    <Badge variant={status === "enRoute" ? "danger" : "info"} size="sm" showDot>
                      {statusBadgeText[status] || "Active Request"}
                    </Badge>
                    <h1 className="text-2xl font-extrabold text-[#0F172A]">
                      Emergency Assistance Tracking
                    </h1>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-[#64748B]">Estimated Arrival</span>
                    <p className="text-lg font-extrabold text-[#EF4444]">{estimatedArrival}</p>
                  </div>
                </div>

                {/* Safety notice banner */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-[#64748B] flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-[#2563EB] shrink-0" />
                  <span>Simulated Provider Tracker — Demo representation only.</span>
                </div>
              </Card>

              {/* Stylized Visual Tracking Diagram */}
              <Card radius="xl" className="p-6 bg-white border border-[#E2E8F0]">
                <TrackingMap vehicleName={provider.vehicleName} estimatedArrival={estimatedArrival} />
              </Card>

              {/* Assigned Provider Card */}
              <Card radius="xl" className="p-6 bg-white border border-[#E2E8F0] space-y-4">
                <h3 className="font-bold text-base text-[#0F172A] flex items-center gap-2">
                  <Siren className="h-5 w-5 text-[#EF4444]" /> Assigned Dispatch Provider
                </h3>

                <div className="p-4 rounded-2xl bg-red-50/60 border border-red-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-bold text-base text-[#0F172A]">{provider.vehicleName}</p>
                    <p className="text-xs text-[#2563EB] font-semibold">{provider.vehicleType}</p>
                    <p className="text-xs text-[#64748B]">Driver: {provider.driverName}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="border-emerald-300 text-emerald-800 bg-emerald-50">
                      <Phone className="h-3.5 w-3.5 mr-1" /> Call Unit
                    </Button>
                  </div>
                </div>
              </Card>
            </main>

            {/* Right Sidebar Column: Timeline & Cancel Action */}
            <aside className="lg:col-span-4 space-y-6">
              {/* Timeline Card */}
              <Card radius="xl" className="p-6 bg-white border border-[#E2E8F0] space-y-4 shadow-xs">
                <h3 className="font-bold text-base text-[#0F172A] pb-3 border-b border-slate-100">
                  Request Progress
                </h3>
                <EmergencyTimeline currentStatus={status} />
              </Card>

              {/* Location Confirmation Summary */}
              <Card radius="xl" className="p-6 bg-white border border-[#E2E8F0] space-y-3 text-xs">
                <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">Dispatch Location</h4>
                <div className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-[#2563EB] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[#0F172A]">{location.name}</p>
                    <p className="text-[#64748B]">{location.address}</p>
                  </div>
                </div>
              </Card>

              {/* Cancellation Button */}
              <Button
                variant="outline"
                size="md"
                className="w-full border-red-200 text-[#EF4444] hover:bg-red-50 justify-center"
                onClick={() => setIsCancelDialogOpen(true)}
              >
                Cancel Emergency Request
              </Button>
            </aside>
          </div>
        )}

        {/* Cancellation Confirmation Dialog */}
        <CancelRequestDialog
          isOpen={isCancelDialogOpen}
          onClose={() => setIsCancelDialogOpen(false)}
          onConfirmCancel={cancelRequest}
        />
      </PageContainer>
    </div>
  );
}

export default function StatusPage() {
  return (
    <EmergencyProviderContext>
      <Suspense fallback={<div className="py-20 text-center text-sm text-slate-500">Loading Status...</div>}>
        <StatusContent />
      </Suspense>
    </EmergencyProviderContext>
  );
}
