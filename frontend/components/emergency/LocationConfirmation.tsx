"use client";

import React, { useState } from "react";
import { MapPin, Navigation, Edit2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { EmergencyLocation } from "@/context/EmergencyContext";

interface LocationConfirmationProps {
  location: EmergencyLocation;
  onUpdateLocation: (loc: EmergencyLocation) => void;
}

export const LocationConfirmation: React.FC<LocationConfirmationProps> = ({
  location,
  onUpdateLocation,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [customAddress, setCustomAddress] = useState(location.address || "");
  const [customCity, setCustomCity] = useState(location.city || "");

  const handleSaveManualLocation = () => {
    onUpdateLocation({
      name: `${customCity || "Custom Location"}, Haryana`,
      isDetected: false,
      address: customAddress,
      city: customCity,
      state: "Haryana",
    });
    setIsEditing(false);
  };

  return (
    <Card radius="xl" className="p-6 bg-white border border-[#E2E8F0] space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-base text-[#0F172A] flex items-center gap-2">
          <Navigation className="h-5 w-5 text-[#2563EB]" /> Emergency Location
        </h3>
        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
        >
          <Edit2 className="h-3.5 w-3.5" />
          <span>{isEditing ? "Cancel" : "Change Location"}</span>
        </button>
      </div>

      {!isEditing ? (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-100 text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[#0F172A]">{location.name}</span>
              {location.isDetected && (
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-[#10B981] text-[10px] font-bold">
                  Mock GPS Detected
                </span>
              )}
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">{location.address}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3 pt-2">
          <Input
            label="Street Address / Landmark *"
            placeholder="Enter street name, house number, or landmark"
            value={customAddress}
            onChange={(e) => setCustomAddress(e.target.value)}
          />
          <Input
            label="City *"
            placeholder="Enter city"
            value={customCity}
            onChange={(e) => setCustomCity(e.target.value)}
          />
          <Button variant="primary" size="sm" onClick={handleSaveManualLocation}>
            Save Location
          </Button>
        </div>
      )}
    </Card>
  );
};
