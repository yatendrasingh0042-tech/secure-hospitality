import React from "react";
import dynamic from "next/dynamic";
import { HomeClientContainer } from "@/components/home/HomeClientContainer";

// Dynamically import below-the-fold preview sections for code-splitting
const DoctorPreview = dynamic(
  () => import("@/components/home/DoctorPreview").then((mod) => mod.DoctorPreview),
  { loading: () => <div className="py-12 text-center text-xs text-slate-400">Loading Doctor Preview...</div> }
);

const MedicinePreview = dynamic(
  () => import("@/components/home/MedicinePreview").then((mod) => mod.MedicinePreview),
  { loading: () => <div className="py-12 text-center text-xs text-[#64748B]">Loading Medicine Preview...</div> }
);

const HospitalPreview = dynamic(
  () => import("@/components/home/HospitalPreview").then((mod) => mod.HospitalPreview),
  { loading: () => <div className="py-12 text-center text-xs text-[#64748B]">Loading Hospital Preview...</div> }
);

const HowItWorks = dynamic(
  () => import("@/components/home/HowItWorks").then((mod) => mod.HowItWorks)
);

const HealthManagement = dynamic(
  () => import("@/components/home/HealthManagement").then((mod) => mod.HealthManagement)
);

const TrustSection = dynamic(
  () => import("@/components/home/TrustSection").then((mod) => mod.TrustSection)
);

const FinalCTA = dynamic(
  () => import("@/components/home/FinalCTA").then((mod) => mod.FinalCTA)
);

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HomeClientContainer>
        {/* 4. DOCTOR DISCOVERY PREVIEW */}
        <DoctorPreview />

        {/* 5. MEDICINE ORDERING PREVIEW */}
        <MedicinePreview />

        {/* 6. HOSPITAL DISCOVERY PREVIEW */}
        <HospitalPreview />

        {/* 7. HOW IT WORKS */}
        <HowItWorks />

        {/* 8. HEALTH MANAGEMENT */}
        <HealthManagement />

        {/* 9. TRUST & SECURITY */}
        <TrustSection />

        {/* 10. FINAL CALL TO ACTION */}
        <FinalCTA />
      </HomeClientContainer>
    </div>
  );
}
