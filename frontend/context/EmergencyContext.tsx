"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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
  confirmRequest: () => void;
  updateStatus: (newStatus: EmergencyStatusType) => void;
  cancelRequest: () => void;
  resetEmergency: () => void;
}

const defaultLocation: EmergencyLocation = {
  name: "Daulatabad, Haryana",
  isDetected: true,
  address: "Sector 14, Main Expressway Road",
  city: "Daulatabad",
  state: "Haryana",
  pinCode: "122006",
};

const defaultContact: EmergencyContact = {
  name: "Mother (Primary)",
  phone: "+91 98765 43210",
  relation: "Parent",
};

const defaultProvider: EmergencyProvider = {
  vehicleName: "Secure Ambulance 04",
  vehicleType: "Advanced Life Support (ALS) Van",
  driverName: "Paramedic Rajesh Kumar",
  phone: "+91 98100 11223",
};

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

export const EmergencyProviderContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<EmergencyStatusType>("idle");
  const [assistanceType, setAssistanceType] = useState<AssistanceType>("ambulance");
  const [location, setLocation] = useState<EmergencyLocation>(defaultLocation);
  const [emergencyContact] = useState<EmergencyContact>(defaultContact);
  const [requestId] = useState<string>("SH-EM-2026-001");
  const [provider] = useState<EmergencyProvider>(defaultProvider);
  const [estimatedArrival, setEstimatedArrival] = useState<string>("8 mins");

  // Automatic simulated status progression when requested
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

  const confirmRequest = () => {
    setStatus("requesting");
  };

  const updateStatus = (newStatus: EmergencyStatusType) => {
    setStatus(newStatus);
  };

  const cancelRequest = () => {
    setStatus("cancelled");
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
