"use client";

import React, { useState, useEffect } from "react";
import { useSafeRouter } from "@/hooks/useSafeRouter";
import { MapPin, ArrowRight, Home } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { AvatarPicker, DobPicker } from "@/components/profile";
import { ToastContainer, ToastType } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";

export default function OnboardingProfileStepPage() {
  const router = useSafeRouter();
  const { user, updateUser, isLoading } = useAuth();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [dob, setDob] = useState(user?.dateOfBirth || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [gender, setGender] = useState<"Male" | "Female" | "Other" | "Prefer not to say">(user?.gender || "Male");
  const [address, setAddress] = useState(user?.address || "");
  const [city, setCity] = useState(user?.city || "");
  const [state, setState] = useState(user?.state || "");
  const [isSaving, setIsSaving] = useState(false);

  const [toasts, setToasts] = useState<Array<{ id: string; type?: ToastType; title: string; message?: string }>>([]);

  // Sync state when authenticated user data finishes hydrating from backend
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setPhone(user.phone || "");
      setDob(user.dateOfBirth || "");
      setAvatar(user.avatar || "");
      setGender(user.gender || "Male");
      setAddress(user.address || "");
      setCity(user.city || "");
      setState(user.state || "");
    }
  }, [user]);

  const addToast = (title: string, message?: string, type: ToastType = "error") => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await updateUser({
        firstName,
        lastName,
        phone,
        dateOfBirth: dob,
        avatar,
        gender,
        address,
        city,
        state,
      });
      setIsSaving(false);
      router.push("/onboarding/emergency-contacts");
    } catch (err: any) {
      setIsSaving(false);
      addToast("Save Failed", err.message || "Failed to save profile. Please try again.");
    }
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

            {/* Real Interactive Avatar Upload */}
            <AvatarPicker
              avatarUrl={avatar}
              firstName={firstName || "User"}
              lastName={lastName}
              onChange={(newAvatarUrl) => setAvatar(newAvatarUrl)}
              onError={(errorMsg) => addToast("Avatar Upload Error", errorMsg, "error")}
            />

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
                <DobPicker
                  label="Date of Birth"
                  value={dob}
                  onChange={(newDobIso) => setDob(newDobIso)}
                  onError={(errorMsg) => addToast("Date Selection Error", errorMsg, "error")}
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

              <Input
                label="Residential Address"
                placeholder="e.g. Sector 14, Main Expressway Road"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                leftIcon={<Home className="h-4 w-4" />}
              />

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
                  isLoading={isSaving || isLoading}
                  className="w-full bg-[#2563EB] hover:bg-blue-700 font-bold"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Next: Emergency Contacts
                </Button>
              </div>
            </form>
          </Card>
        </div>

        <ToastContainer toasts={toasts} onClose={removeToast} />
      </PageContainer>
    </div>
  );
}


