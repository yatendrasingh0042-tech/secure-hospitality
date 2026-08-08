"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { useAuth } from "@/context/AuthContext";
import { UserPreferences } from "@/types/user";

export default function OnboardingPreferencesStepPage() {
  const router = useRouter();
  const { user, updateUser, completeOnboarding } = useAuth();

  const [consultationType, setConsultationType] = useState<"in_person" | "video" | "both">(
    user?.preferences?.consultationType || "both"
  );

  const [appointmentReminders, setAppointmentReminders] = useState(
    user?.preferences?.appointmentReminders ?? true
  );
  const [medicineReminders, setMedicineReminders] = useState(
    user?.preferences?.medicineReminders ?? true
  );
  const [orderUpdates, setOrderUpdates] = useState(
    user?.preferences?.orderUpdates ?? true
  );
  const [emergencyAlerts, setEmergencyAlerts] = useState(
    user?.preferences?.emergencyAlerts ?? true
  );

  const handleFinish = () => {
    const prefs: UserPreferences = {
      consultationType,
      appointmentReminders,
      medicineReminders,
      orderUpdates,
      emergencyAlerts,
    };
    updateUser({ preferences: prefs });
    completeOnboarding();
    router.push("/profile");
  };

  return (
    <div className="py-8 lg:py-14 bg-[#F8FAFC] min-h-screen">
      <PageContainer>
        <OnboardingProgress currentStep={3} />

        <div className="max-w-xl mx-auto space-y-6">
          <Card radius="xl" className="p-6 sm:p-8 bg-white border border-[#E2E8F0] shadow-md space-y-6">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-[#0F172A]">Healthcare Preferences</h1>
              <p className="text-xs text-[#64748B]">Personalize your consultation choices and notification settings.</p>
            </div>

            {/* Preferred Consultation Type */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                Preferred Consultation Mode
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setConsultationType("in_person")}
                  className={`p-3 rounded-2xl border text-xs font-bold text-center transition-all ${
                    consultationType === "in_person"
                      ? "bg-blue-50 border-[#2563EB] text-[#2563EB]"
                      : "bg-white border-slate-200 text-[#0F172A] hover:bg-slate-50"
                  }`}
                >
                  In-Person
                </button>
                <button
                  type="button"
                  onClick={() => setConsultationType("video")}
                  className={`p-3 rounded-2xl border text-xs font-bold text-center transition-all ${
                    consultationType === "video"
                      ? "bg-blue-50 border-[#2563EB] text-[#2563EB]"
                      : "bg-white border-slate-200 text-[#0F172A] hover:bg-slate-50"
                  }`}
                >
                  Video Call
                </button>
                <button
                  type="button"
                  onClick={() => setConsultationType("both")}
                  className={`p-3 rounded-2xl border text-xs font-bold text-center transition-all ${
                    consultationType === "both"
                      ? "bg-blue-50 border-[#2563EB] text-[#2563EB]"
                      : "bg-white border-slate-200 text-[#0F172A] hover:bg-slate-50"
                  }`}
                >
                  Both Options
                </button>
              </div>
            </div>

            {/* Notification Toggles */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                Notification Preferences
              </label>

              <div className="space-y-2">
                <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold cursor-pointer">
                  <span>Appointment Reminders</span>
                  <input
                    type="checkbox"
                    checked={appointmentReminders}
                    onChange={(e) => setAppointmentReminders(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold cursor-pointer">
                  <span>Medicine Refill Reminders</span>
                  <input
                    type="checkbox"
                    checked={medicineReminders}
                    onChange={(e) => setMedicineReminders(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold cursor-pointer">
                  <span>Order Delivery Updates</span>
                  <input
                    type="checkbox"
                    checked={orderUpdates}
                    onChange={(e) => setOrderUpdates(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold cursor-pointer">
                  <span>Emergency Dispatch Alerts</span>
                  <input
                    type="checkbox"
                    checked={emergencyAlerts}
                    onChange={(e) => setEmergencyAlerts(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
                  />
                </label>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-[#64748B] flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#2563EB] shrink-0" />
              <span>Preferences are saved locally in demo state. No notifications are sent.</span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="outline"
                size="md"
                className="flex-1"
                leftIcon={<ArrowLeft className="h-4 w-4" />}
                onClick={() => router.push("/onboarding/emergency-contacts")}
              >
                Back
              </Button>
              <Button
                variant="primary"
                size="md"
                className="flex-1 bg-[#10B981] hover:bg-emerald-700 font-bold text-white"
                rightIcon={<CheckCircle2 className="h-4 w-4" />}
                onClick={handleFinish}
              >
                Complete Setup
              </Button>
            </div>
          </Card>
        </div>
      </PageContainer>
    </div>
  );
}
