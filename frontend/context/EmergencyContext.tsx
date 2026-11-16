"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { apiRequest } from "@/lib/apiClient";

export type EmergencyStatusType =
  | "idle"
  | "requesting"
  | "requested"
  | "assigned"
  | "enRoute"
  | "arrived"
  | "completed"
  | "cancelled";

export type AssistanceType = "ambulance" | "hospital_guidance" | "contacts";

export interface EmergencyLocation {
  name: string;
  isDetected: boolean;
  address?: string;
  city?: string;
  state?: string;
  pinCode?: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

export interface EmergencyProvider {
  vehicleName: string;
  vehicleType: string;
  driverName: string;
  phone: string;
}

interface EmergencyContextType {
  status: EmergencyStatusType;
  assistanceType: AssistanceType;
  location: EmergencyLocation;
  emergencyContact: EmergencyContact;
  requestId: string;
  provider: EmergencyProvider;
  estimatedArrival: string;
  setAssistanceType: (type: AssistanceType) => void;
  setLocation: (loc: EmergencyLocation) => void;
  confirmRequest: () => Promise<void>;
  updateStatus: (newStatus: EmergencyStatusType) => void;
  cancelRequest: () => Promise<void>;
  resetEmergency: () => void;
}

import { useAuth } from "@/context/AuthContext";

const defaultLocation: EmergencyLocation = {
  name: "Daulatabad, Haryana",
  isDetected: true,
  address: "Sector 14, Main Expressway Road",
  city: "Daulatabad",
  state: "Haryana",
  pinCode: "122006",
};

const defaultProvider: EmergencyProvider = {
  vehicleName: "Secure Ambulance 04",
  vehicleType: "Advanced Life Support (ALS) Van",
  driverName: "Paramedic Rajesh Kumar",
  phone: "+91 98100 11223",
};

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

export const EmergencyProviderContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [status, setStatus] = useState<EmergencyStatusType>("idle");
  const [assistanceType, setAssistanceType] = useState<AssistanceType>("ambulance");
  const [location, setLocation] = useState<EmergencyLocation>(defaultLocation);
  const [requestId, setRequestId] = useState<string>("SH-EM-2026-001");
  const [provider, setProvider] = useState<EmergencyProvider>(defaultProvider);
  const [estimatedArrival, setEstimatedArrival] = useState<string>("8 mins");

  const primaryUserContact = user?.emergencyContacts && user.emergencyContacts.length > 0
    ? {
        name: user.emergencyContacts[0].name,
        phone: user.emergencyContacts[0].phone,
        relation: user.emergencyContacts[0].relation || user.emergencyContacts[0].relationship || "Contact",
      }
    : { name: "", phone: "", relation: "" };

  const emergencyContact = primaryUserContact;

  // Automatic state progression simulation when requested
  useEffect(() => {
    if (status === "requesting") {
      const t1 = setTimeout(() => setStatus("requested"), 1000);
      return () => clearTimeout(t1);
    }
    if (status === "requested") {
      const t2 = setTimeout(() => setStatus("assigned"), 2000);
      return () => clearTimeout(t2);
    }
    if (status === "assigned") {
      const t3 = setTimeout(() => {
        setStatus("enRoute");
        setEstimatedArrival("6 mins");
      }, 2500);
      return () => clearTimeout(t3);
    }
  }, [status]);

  const confirmRequest = async () => {
    setStatus("requesting");
    try {
      const payload = {
        pickupLocation: {
          address: location.address || location.name,
          city: location.city || "Daulatabad",
          state: location.state || "Haryana",
          coordinates: [77.0266, 28.4595], // GeoJSON [lng, lat]
        },
        emergencyType: assistanceType === "ambulance" ? "critical_cardiac" : "trauma",
        contactNumber: emergencyContact.phone,
        symptoms: ["Shortness of breath", "Severe chest pain"],
      };

      const res = await apiRequest("/api/ambulances/request", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (res && res.success && res.data) {
        setRequestId(res.data._id || `SH-EM-${Date.now()}`);
        if (res.data.assignedAmbulanceId) {
          setProvider({
            vehicleName: res.data.assignedAmbulanceId.vehicleNumber || "Secure Ambulance 04",
            vehicleType: res.data.assignedAmbulanceId.type || "ALS Van",
            driverName: res.data.assignedAmbulanceId.driver?.name || "Paramedic Rajesh Kumar",
            phone: res.data.assignedAmbulanceId.contact || "+91 98100 11223",
          });
        }
      }
    } catch (err) {
      console.warn("Backend emergency dispatch notice:", err);
    }
  };

  const updateStatus = (newStatus: EmergencyStatusType) => {
    setStatus(newStatus);
    if (requestId && requestId.length === 24) {
      apiRequest(`/api/ambulances/request/${requestId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus === "enRoute" ? "en_route" : newStatus }),
      }).catch(() => {});
    }
  };

  const cancelRequest = async () => {
    setStatus("cancelled");
    if (requestId && requestId.length === 24) {
      apiRequest(`/api/ambulances/request/${requestId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: "cancelled", cancellationReason: "Cancelled by requester" }),
      }).catch(() => {});
    }
  };

  const resetEmergency = () => {
    setStatus("idle");
    setAssistanceType("ambulance");
    setLocation(defaultLocation);
    setEstimatedArrival("8 mins");
  };

  return (
    <EmergencyContext.Provider
      value={{
        status,
        assistanceType,
        location,
        emergencyContact,
        requestId,
        provider,
        estimatedArrival,
        setAssistanceType,
        setLocation,
        confirmRequest,
        updateStatus,
        cancelRequest,
        resetEmergency,
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
};

export const useEmergency = () => {
  const context = useContext(EmergencyContext);
  if (!context) {
    throw new Error("useEmergency must be used within an EmergencyProviderContext");
  }
  return context;
};
