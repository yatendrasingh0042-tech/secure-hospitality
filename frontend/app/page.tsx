"use client";

import React, { useState } from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { QuickServices } from "@/components/home/QuickServices";
import { EmergencySection } from "@/components/home/EmergencySection";
import { EmergencyModal } from "@/components/home/EmergencyModal";
import { DoctorPreview } from "@/components/home/DoctorPreview";
import { MedicinePreview } from "@/components/home/MedicinePreview";
import { HospitalPreview } from "@/components/home/HospitalPreview";
import { HowItWorks } from "@/components/home/HowItWorks";
import { HealthManagement } from "@/components/home/HealthManagement";
import { TrustSection } from "@/components/home/TrustSection";
import { FinalCTA } from "@/components/home/FinalCTA";

export default function Home() {
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  const handleScrollToDoctors = () => {
    const el = document.getElementById("doctors");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectService = (serviceId: string) => {
    if (serviceId === "emergency") {
      setIsEmergencyModalOpen(true);
      return;
    }
    const targetMap: Record<string, string> = {
      "doctor-appointments": "doctors",
      medicines: "medicines",
      hospitals: "hospitals",
      "health-records": "health-management",
      "medication-reminders": "health-management",
    };

    const targetId = targetMap[serviceId] || serviceId;
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <HeroSection
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
        onScrollToDoctors={handleScrollToDoctors}
      />

      {/* 2. QUICK HEALTHCARE SERVICES */}
      <QuickServices onSelectService={handleSelectService} />

      {/* 3. EMERGENCY ASSISTANCE */}
      <EmergencySection onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)} />

      {/* 4. DOCTOR DISCOVERY */}
      <DoctorPreview />

      {/* 5. MEDICINE ORDERING PREVIEW */}
      <MedicinePreview />

      {/* 6. HOSPITAL DISCOVERY */}
      <HospitalPreview />

      {/* 7. HOW IT WORKS */}
      <HowItWorks />

      {/* 8. HEALTH MANAGEMENT */}
      <HealthManagement />

      {/* 9. TRUST & SECURITY */}
      <TrustSection />

      {/* 10. FINAL CALL TO ACTION */}
      <FinalCTA
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
        onScrollToDoctors={handleScrollToDoctors}
      />

      {/* EMERGENCY ASSISTANCE MODAL */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />
    </div>
  );
}
