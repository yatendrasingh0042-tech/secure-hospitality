"use client";

import React, { createContext, useContext, useState } from "react";
import { Doctor } from "@/types/doctor";
import { Hospital } from "@/types/hospital";

export type AppointmentType = "in_person" | "video" | "follow_up";

export interface PatientInfo {
  fullName: string;
  age: string;
  phone: string;
  email: string;
  reason: string;
  notes?: string;
}

interface AppointmentContextType {
  selectedDoctor: Doctor | null;
  selectedHospital: Hospital | null;
  appointmentType: AppointmentType;
  selectedDate: string;
  selectedTime: string;
  patientInformation: PatientInfo;
  currentStep: number; // 1 to 5
  setDoctor: (doctor: Doctor | null) => void;
  setHospital: (hospital: Hospital | null) => void;
  setAppointmentType: (type: AppointmentType) => void;
  setSelectedDate: (date: string) => void;
  setSelectedTime: (time: string) => void;
  setPatientInfo: (info: PatientInfo) => void;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetBooking: () => void;
}

const defaultPatientInfo: PatientInfo = {
  fullName: "",
  age: "",
  phone: "",
  email: "",
  reason: "",
  notes: "",
};

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedDoctor, setSelectedDoctorState] = useState<Doctor | null>(null);
  const [selectedHospital, setSelectedHospitalState] = useState<Hospital | null>(null);
  const [appointmentType, setAppointmentType] = useState<AppointmentType>("in_person");
  const [selectedDate, setSelectedDate] = useState<string>("Today");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [patientInformation, setPatientInformation] = useState<PatientInfo>(defaultPatientInfo);
  const [currentStep, setCurrentStep] = useState<number>(1);

  const setDoctor = (doctor: Doctor | null) => {
    setSelectedDoctorState(doctor);
    if (doctor) setSelectedHospitalState(null);
  };

  const setHospital = (hospital: Hospital | null) => {
    setSelectedHospitalState(hospital);
    if (hospital) setSelectedDoctorState(null);
  };

  const setPatientInfo = (info: PatientInfo) => {
    setPatientInformation(info);
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 5) {
      setCurrentStep(step);
    }
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const resetBooking = () => {
    setSelectedDoctorState(null);
    setSelectedHospitalState(null);
    setAppointmentType("in_person");
    setSelectedDate("Today");
    setSelectedTime("");
    setPatientInformation(defaultPatientInfo);
    setCurrentStep(1);
  };

  return (
    <AppointmentContext.Provider
      value={{
        selectedDoctor,
        selectedHospital,
        appointmentType,
        selectedDate,
        selectedTime,
        patientInformation,
        currentStep,
        setDoctor,
        setHospital,
        setAppointmentType,
        setSelectedDate,
        setSelectedTime,
        setPatientInfo,
        goToStep,
        nextStep,
        prevStep,
        resetBooking,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointment = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error("useAppointment must be used within an AppointmentProvider");
  }
  return context;
};
