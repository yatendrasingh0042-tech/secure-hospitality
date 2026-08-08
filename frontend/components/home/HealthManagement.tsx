"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Calendar,
  Bell,
  FileText,
  CheckCircle2,
  ChevronRight,
  Shield,
  Pill,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageContainer } from "@/components/layout/PageContainer";

export const HealthManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "appointments" | "records" | "reminders">("overview");

  return (
    <section id="health-management" className="py-16 sm:py-24 bg-[#F8FAFC] border-b border-slate-200/70">
      <PageContainer>
        <SectionHeading
          eyebrow="Centralized Care Dashboard"
          heading="Unified Health Management"
          description="Access your upcoming visits, active prescriptions, digital lab reports, and automated dose reminders in one personal hub."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Dashboard Control Panel Tabs */}
          <div className="lg:col-span-4 space-y-3">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${
                activeTab === "overview"
                  ? "bg-white border-[#2563EB] shadow-md text-[#0F172A]"
                  : "bg-white/60 border-slate-200 text-[#64748B] hover:bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${activeTab === "overview" ? "bg-blue-100 text-[#2563EB]" : "bg-slate-100 text-slate-500"}`}>
                  <LayoutDashboard className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-sm">Health Overview</p>
                  <p className="text-xs text-[#64748B]">Complete patient summary</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("appointments")}
              className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${
                activeTab === "appointments"
                  ? "bg-white border-[#2563EB] shadow-md text-[#0F172A]"
                  : "bg-white/60 border-slate-200 text-[#64748B] hover:bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${activeTab === "appointments" ? "bg-blue-100 text-[#2563EB]" : "bg-slate-100 text-slate-500"}`}>
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-sm">Upcoming Appointments</p>
                  <p className="text-xs text-[#64748B]">1 Confirmed Visit</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("reminders")}
              className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${
                activeTab === "reminders"
                  ? "bg-white border-[#2563EB] shadow-md text-[#0F172A]"
                  : "bg-white/60 border-slate-200 text-[#64748B] hover:bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${activeTab === "reminders" ? "bg-amber-100 text-[#F59E0B]" : "bg-slate-100 text-slate-500"}`}>
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-sm">Medication Reminders</p>
                  <p className="text-xs text-[#64748B]">Next dose: 8:00 PM</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("records")}
              className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${
                activeTab === "records"
                  ? "bg-white border-[#2563EB] shadow-md text-[#0F172A]"
                  : "bg-white/60 border-slate-200 text-[#64748B] hover:bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${activeTab === "records" ? "bg-emerald-100 text-[#10B981]" : "bg-slate-100 text-slate-500"}`}>
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-sm">Health Records</p>
                  <p className="text-xs text-[#64748B]">12 Encrypted Reports</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </button>
          </div>

          {/* Interactive Dashboard Preview Card */}
          <div className="lg:col-span-8">
            <Card variant="elevated" radius="xl" className="p-6 sm:p-8 bg-white border border-slate-200 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center border border-blue-100">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#0F172A]">Personal Health Hub</h3>
                    <p className="text-xs text-[#64748B]">Mock Dashboard Interface</p>
                  </div>
                </div>
                <Badge variant="success" size="sm" showDot>
                  Sync Active
                </Badge>
              </div>

              {/* Dynamic Content Views */}
              {(activeTab === "overview" || activeTab === "appointments") && (
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold uppercase tracking-wider text-[#2563EB] flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" /> Upcoming Visit
                    </span>
                    <Badge variant="info" size="sm">Tomorrow · 10:30 AM</Badge>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-[#2563EB] text-white font-bold flex items-center justify-center text-sm">
                        AS
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#0F172A]">Dr. Ananya Sharma</h4>
                        <p className="text-xs text-[#64748B]">Cardiology Consultation · Video Call</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Reschedule</Button>
                  </div>
                </div>
              )}

              {(activeTab === "overview" || activeTab === "reminders") && (
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold uppercase tracking-wider text-[#F59E0B] flex items-center gap-1.5">
                      <Bell className="h-3.5 w-3.5" /> Medication Alarm
                    </span>
                    <span className="text-xs font-semibold text-amber-800">Next: 8:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                        <Pill className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#0F172A]">Paracetamol ER (650mg)</h4>
                        <p className="text-xs text-[#64748B]">1 Tablet after dinner · Daily</p>
                      </div>
                    </div>
                    <Badge variant="warning" size="sm">Active Schedule</Badge>
                  </div>
                </div>
              )}

              {(activeTab === "overview" || activeTab === "records") && (
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold uppercase tracking-wider text-[#10B981] flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5" /> Digital Health Records
                    </span>
                    <span className="text-xs text-[#64748B]">12 Records Stored</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                    <div className="p-2.5 rounded-xl bg-white border border-emerald-200/60 flex items-center justify-between">
                      <span className="font-semibold text-[#0F172A]">Lipid Profile Report.pdf</span>
                      <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-emerald-200/60 flex items-center justify-between">
                      <span className="font-semibold text-[#0F172A]">Cardio ECG Analysis.pdf</span>
                      <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </PageContainer>
    </section>
  );
};
