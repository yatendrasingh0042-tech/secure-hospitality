"use client";

import React, { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { HeroSection } from "@/components/home/HeroSection";
import { QuickServices } from "@/components/home/QuickServices";
import { EmergencySection } from "@/components/home/EmergencySection";

const EmergencyModal = dynamic(
  () => import("@/components/home/EmergencyModal").then((mod) => mod.EmergencyModal),
  { ssr: false }
);

interface HomeClientContainerProps {
  children?: React.ReactNode;
}

export const HomeClientContainer: React.FC<HomeClientContainerProps> = ({ children }) => {
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  const handleOpenEmergencyModal = useCallback(() => {
    setIsEmergencyModalOpen(true);
  }, []);

  const handleCloseEmergencyModal = useCallback(() => {
    setIsEmergencyModalOpen(false);
  }, []);

  const handleScrollToDoctors = useCallback(() => {
    const el = document.getElementById("doctors");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handleSelectService = useCallback((serviceId: string) => {
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
  }, []);

  return (
    <>
      {/* 1. HERO SECTION */}
      <HeroSection
        onOpenEmergencyModal={handleOpenEmergencyModal}
        onScrollToDoctors={handleScrollToDoctors}
      />

      {/* 2. QUICK HEALTHCARE SERVICES */}
      <QuickServices onSelectService={handleSelectService} />

      {/* 3. EMERGENCY ASSISTANCE */}
      <EmergencySection onOpenEmergencyModal={handleOpenEmergencyModal} />

      {/* BELOW-THE-FOLD SECTIONS */}
      {children}

      {/* EMERGENCY ASSISTANCE MODAL */}
      {isEmergencyModalOpen && (
        <EmergencyModal
          isOpen={isEmergencyModalOpen}
          onClose={handleCloseEmergencyModal}
        />
      )}
    </>
  );
};
