"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { WifiOff } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmergencyHero } from "@/components/emergency/EmergencyHero";
import { AssistanceTypeCard } from "@/components/emergency/AssistanceTypeCard";
import { LocationConfirmation } from "@/components/emergency/LocationConfirmation";
import { EmergencyContactCard } from "@/components/emergency/EmergencyContactCard";
import { NearbyEmergencyCare } from "@/components/emergency/NearbyEmergencyCare";
import { EmergencyProviderContext, useEmergency } from "@/context/EmergencyContext";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

function EmergencyLandingContent() {
  const router = useRouter();
  const { assistanceType, setAssistanceType, location, setLocation } = useEmergency();
  const { isOnline } = useOnlineStatus();

  const handleStartRequest = () => {
    router.push("/emergency/confirm");
  };

  return (
    <div className="py-8 lg:py-14 bg-[#F8FAFC] min-h-screen">
      <PageContainer>
        {!isOnline && (
          <div className="max-w-4xl mx-auto mb-6">
            <Card radius="xl" className="p-4 bg-red-600 text-white border-none space-y-2 text-xs shadow-md">
              <div className="flex items-center gap-2 font-bold text-sm">
                <WifiOff className="h-5 w-5 shrink-0" />
                <span>Connection Unavailable</span>
              </div>
              <p className="text-red-100 leading-relaxed">
                Emergency assistance dispatch features require an active internet connection. If you are experiencing a real emergency, call local emergency services directly (<strong>102 / 108</strong>).
              </p>
            </Card>
          </div>
        )}

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <Badge variant="danger" size="sm" showDot className="bg-red-50 text-[#EF4444] border-red-200">
            Emergency Response Portal
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Emergency Assistance
          </h1>
          <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
            Get help when you need it most. Choose the assistance you need and follow the clear steps.
          </p>
        </div>

        {/* Emergency Hero Banner */}
        <div className="max-w-4xl mx-auto mb-10">
          <EmergencyHero onRequestClick={handleStartRequest} />
        </div>

        {/* Assistance Type Options */}
        <div className="max-w-4xl mx-auto space-y-4 mb-10">
          <h3 className="font-bold text-base text-[#0F172A]">Select Assistance Type</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <AssistanceTypeCard
              type="ambulance"
              title="Ambulance Assistance"
              description="Request immediate dispatch of an emergency ALS ambulance van."
              icon="Siren"
              isSelected={assistanceType === "ambulance"}
              onSelect={setAssistanceType}
            />
            <AssistanceTypeCard
              type="hospital_guidance"
              title="Hospital Guidance"
              description="Locate accredited 24/7 ER trauma centers and bed availability."
              icon="Building2"
              isSelected={assistanceType === "hospital_guidance"}
              onSelect={setAssistanceType}
            />
            <AssistanceTypeCard
              type="contacts"
              title="Emergency Contacts"
              description="Notify primary family contacts with demo location alerts."
              icon="PhoneCall"
              isSelected={assistanceType === "contacts"}
              onSelect={setAssistanceType}
            />
          </div>
        </div>

        {/* Location & Contacts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-4xl mx-auto mb-10">
          <div className="lg:col-span-6 w-full">
            <LocationConfirmation location={location} onUpdateLocation={setLocation} />
          </div>
          <div className="lg:col-span-6 w-full">
            <EmergencyContactCard />
          </div>
        </div>

        {/* Nearby Hospitals */}
        <div className="max-w-4xl mx-auto">
          <NearbyEmergencyCare />
        </div>
      </PageContainer>
    </div>
  );
}

export default function EmergencyPage() {
  return (
    <EmergencyProviderContext>
      <EmergencyLandingContent />
    </EmergencyProviderContext>
  );
}
