"use client";

import React from "react";
import { User, Phone, Mail, FileText } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { PatientInfo } from "@/context/AppointmentContext";

interface PatientFormProps {
  initialValues: PatientInfo;
  onChange: (info: PatientInfo) => void;
  errors: Record<string, string>;
}

export const PatientForm: React.FC<PatientFormProps> = ({
  initialValues,
  onChange,
  errors,
}) => {
  const handleChange = (field: keyof PatientInfo, value: string) => {
    onChange({
      ...initialValues,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
        <User className="h-5 w-5 text-[#2563EB]" />
        <h3 className="font-bold text-base text-[#0F172A]">Patient Details</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <Input
          label="Full Name *"
          placeholder="e.g. John Doe"
          leftIcon={<User className="h-4 w-4" />}
          value={initialValues.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          error={errors.fullName}
        />

        {/* Age */}
        <Input
          label="Age (Years) *"
          placeholder="e.g. 32"
          type="number"
          min="1"
          max="120"
          value={initialValues.age}
          onChange={(e) => handleChange("age", e.target.value)}
          error={errors.age}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Phone Number */}
        <Input
          label="Phone Number *"
          placeholder="e.g. +1 (555) 019-2834"
          type="tel"
          leftIcon={<Phone className="h-4 w-4" />}
          value={initialValues.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          error={errors.phone}
        />

        {/* Email Address */}
        <Input
          label="Email Address *"
          placeholder="e.g. patient@example.com"
          type="email"
          leftIcon={<Mail className="h-4 w-4" />}
          value={initialValues.email}
          onChange={(e) => handleChange("email", e.target.value)}
          error={errors.email}
        />
      </div>

      {/* Reason for Visit */}
      <Input
        label="Reason for Visit *"
        placeholder="e.g. Routine cardiology checkup, chest discomfort, or follow-up"
        leftIcon={<FileText className="h-4 w-4" />}
        value={initialValues.reason}
        onChange={(e) => handleChange("reason", e.target.value)}
        error={errors.reason}
      />

      {/* Optional Notes */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-[#0F172A]">
          Additional Clinical Notes (Optional)
        </label>
        <textarea
          rows={3}
          placeholder="Mention existing conditions, allergies, or questions for the doctor..."
          value={initialValues.notes || ""}
          onChange={(e) => handleChange("notes", e.target.value)}
          className="w-full p-3 bg-white text-[#0F172A] text-sm placeholder:text-[#64748B]/70 rounded-xl border border-[#E2E8F0] hover:border-slate-300 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB] focus:outline-none transition-all duration-200"
        />
      </div>
    </div>
  );
};
