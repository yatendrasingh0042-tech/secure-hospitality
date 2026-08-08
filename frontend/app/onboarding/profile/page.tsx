"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, ArrowRight, Camera } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { useAuth } from "@/context/AuthContext";

export default function OnboardingProfileStepPage() {
  const router = useRouter();
  const { user, updateUser } = useAuth();

  const [firstName, setFirstName] = useState(user?.firstName || "Yatendra");
  const [lastName, setLastName] = useState(user?.lastName || "Singh");
  const [phone, setPhone] = useState(user?.phone || "+91 98765 43210");
  const [dob, setDob] = useState(user?.dateOfBirth || "1994-08-15");
  const [gender, setGender] = useState<"Male" | "Female" | "Other" | "Prefer not to say">(user?.gender || "Male");
  const [city, setCity] = useState(user?.city || "Central City");
  const [state, setState] = useState(user?.state || "Haryana");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      firstName,
      lastName,
      phone,
      dateOfBirth: dob,
      gender,
      city,
      state,
    });
    router.push("/onboarding/emergency-contacts");
  };

  return (
    <div className="py-8 lg:py-14 bg-[#F8FAFC] min-h-screen">
      <PageContainer>
        <OnboardingProgress currentStep={1} />

        <div className="max-w-xl mx-auto space-y-6">
          <Card radius="xl" className="p-6 sm:p-8 bg-white border border-[#E2E8F0] shadow-md space-y-6">
            <div className="space-y-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-[#0F172A]">Basic Profile Information</h1>
              <p className="text-xs text-[#64748B]">Provide your basic details to personalize your account.</p>
            </div>

            {/* Avatar Selector Demo */}
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="relative">
                <div className="h-16 w-16 rounded-2xl bg-[#2563EB] text-white font-bold text-xl flex items-center justify-center">
                  {firstName[0] || "Y"}
                  {lastName[0] || "S"}
                </div>
                <button
                  type="button"
                  onClick={() => alert("Avatar upload demo — Select local image")}
                  className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-slate-800 text-white flex items-center justify-center border-2 border-white"
                  aria-label="Upload photo"
                >
                  <Camera className="h-3 w-3" />
                </button>
              </div>

              <div>
                <p className="font-bold text-sm text-[#0F172A]">Profile Avatar</p>
                <p className="text-xs text-[#64748B]">Select a avatar or demonstrate local image selection.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="First Name *"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <Input
                  label="Last Name *"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>

              <Input
                label="Phone Number *"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Date of Birth"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  leftIcon={<Calendar className="h-4 w-4" />}
                />

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#0F172A]">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as "Male" | "Female" | "Other" | "Prefer not to say")}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-[#0F172A] focus:border-[#2563EB] focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  leftIcon={<MapPin className="h-4 w-4" />}
                />
                <Input
                  label="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full bg-[#2563EB] hover:bg-blue-700 font-bold"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Next: Emergency Contacts
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </PageContainer>
    </div>
  );
}
