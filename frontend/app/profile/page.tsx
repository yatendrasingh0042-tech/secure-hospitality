"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSafeRouter } from "@/hooks/useSafeRouter";
import {
  User as UserIcon,
  Mail,
  Shield,
  Sliders,
  LogOut,
  Edit2,
  PhoneCall,
  CheckCircle2,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LogoutModal } from "@/components/auth/LogoutModal";
import { useAuth } from "@/context/AuthContext";

import { formatDobHuman } from "@/components/profile";

export default function ProfilePage() {
  const router = useSafeRouter();
  const { user, isLoading, logout } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleConfirmLogout = () => {
    logout();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="py-8 lg:py-14 bg-[#F8FAFC] min-h-screen">
        <PageContainer>
          <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
            <Card radius="xl" className="p-6 sm:p-8 bg-white border border-[#E2E8F0] space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-full bg-slate-200" />
                <div className="space-y-2">
                  <div className="h-6 w-48 bg-slate-200 rounded" />
                  <div className="h-4 w-32 bg-slate-200 rounded" />
                </div>
              </div>
            </Card>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-6">
                <Card radius="xl" className="p-6 bg-white border border-[#E2E8F0] space-y-4">
                  <div className="h-5 w-40 bg-slate-200 rounded" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-10 bg-slate-200 rounded" />
                    <div className="h-10 bg-slate-200 rounded" />
                  </div>
                </Card>
              </div>
              <div className="lg:col-span-5 space-y-6">
                <Card radius="xl" className="p-6 bg-white border border-[#E2E8F0] space-y-4">
                  <div className="h-5 w-32 bg-slate-200 rounded" />
                  <div className="h-20 bg-slate-200 rounded" />
                </Card>
              </div>
            </div>
          </div>
        </PageContainer>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-8 lg:py-14 bg-[#F8FAFC] min-h-screen">
        <PageContainer>
          <div className="max-w-md mx-auto text-center space-y-4 py-12">
            <Card radius="xl" className="p-8 bg-white border border-[#E2E8F0] space-y-4 shadow-md">
              <UserIcon className="h-12 w-12 text-[#2563EB] mx-auto" />
              <h2 className="text-xl font-bold text-[#0F172A]">Please Sign In</h2>
              <p className="text-xs text-[#64748B]">You need to be logged in to view your profile and management options.</p>
              <Button variant="primary" size="md" className="w-full bg-[#2563EB]" asChild>
                <Link href="/login">Sign In to Account</Link>
              </Button>
            </Card>
          </div>
        </PageContainer>
      </div>
    );
  }

  const displayUser = user;

  return (
    <div className="py-8 lg:py-14 bg-[#F8FAFC] min-h-screen">
      <PageContainer>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Header Banner */}
          <Card radius="xl" className="p-6 sm:p-8 bg-white border border-[#E2E8F0] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {displayUser.avatar ? (
                  <img
                    src={displayUser.avatar}
                    alt={`${displayUser.firstName} ${displayUser.lastName} avatar`}
                    className="h-20 w-20 rounded-full object-cover shadow-lg border-2 border-white ring-2 ring-blue-500/20"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-[#2563EB] text-white font-extrabold text-2xl flex items-center justify-center shadow-lg">
                    {displayUser.firstName[0]}
                    {displayUser.lastName[0]}
                  </div>
                )}
                <div className="space-y-1">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h1 className="text-2xl font-extrabold text-[#0F172A]">
                      {displayUser.firstName} {displayUser.lastName}
                    </h1>
                    <Badge variant="success" size="sm" showDot>
                      Verified Account
                    </Badge>
                  </div>
                  <p className="text-xs text-[#64748B] flex items-center justify-center sm:justify-start gap-1">
                    <Mail className="h-3.5 w-3.5" /> {displayUser.email}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                leftIcon={<Edit2 className="h-3.5 w-3.5" />}
                asChild
              >
                <Link href="/onboarding/profile">Edit Profile</Link>
              </Button>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Personal Info & Contacts */}
            <div className="lg:col-span-7 space-y-6">
              {/* Personal Info Card */}
              <Card radius="xl" className="p-6 bg-white border border-[#E2E8F0] space-y-4">
                <h3 className="font-bold text-base text-[#0F172A] flex items-center gap-2 pb-3 border-b border-slate-100">
                  <UserIcon className="h-5 w-5 text-[#2563EB]" /> Personal Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#64748B] block font-medium">Full Name</span>
                    <span className="font-bold text-[#0F172A]">{displayUser.firstName} {displayUser.lastName}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block font-medium">Email Address</span>
                    <span className="font-bold text-[#0F172A]">{displayUser.email}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block font-medium">Phone Number</span>
                    <span className="font-bold text-[#0F172A]">{displayUser.phone}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block font-medium">Date of Birth</span>
                    <span className="font-bold text-[#0F172A]">{formatDobHuman(displayUser.dateOfBirth)}</span>
                  </div>
                  {displayUser.address && (
                    <div>
                      <span className="text-[#64748B] block font-medium">Residential Address</span>
                      <span className="font-bold text-[#0F172A]">{displayUser.address}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-[#64748B] block font-medium">Location</span>
                    <span className="font-bold text-[#0F172A]">{displayUser.city ? `${displayUser.city}, ${displayUser.state}` : displayUser.state || "Not provided"}</span>
                  </div>
                </div>
              </Card>


              {/* Emergency Contacts Card */}
              <Card radius="xl" className="p-6 bg-white border border-[#E2E8F0] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-base text-[#0F172A] flex items-center gap-2">
                    <PhoneCall className="h-5 w-5 text-[#EF4444]" /> Emergency Contacts
                  </h3>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/onboarding/emergency-contacts">Manage</Link>
                  </Button>
                </div>

                <div className="space-y-3">
                  {displayUser.emergencyContacts.map((cnt) => (
                    <div
                      key={cnt.id}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-[#0F172A]">{cnt.name}</p>
                        <p className="text-[#64748B]">{cnt.phone} · {cnt.relation}</p>
                      </div>
                      <Badge variant="danger" size="sm">
                        Verified Contact
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right Column: Preferences & Account Settings */}
            <div className="lg:col-span-5 space-y-6">
              {/* Preferences Card */}
              <Card radius="xl" className="p-6 bg-white border border-[#E2E8F0] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-base text-[#0F172A] flex items-center gap-2">
                    <Sliders className="h-5 w-5 text-[#2563EB]" /> Healthcare Preferences
                  </h3>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/onboarding/preferences">Edit</Link>
                  </Button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">Consultation Mode</span>
                    <span className="font-bold text-[#0F172A] capitalize">{displayUser.preferences.consultationType.replace("_", " ")}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">Appointment Reminders</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Enabled
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">Medicine Reminders</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Enabled
                    </span>
                  </div>
                </div>
              </Card>

              {/* Account Settings & Logout */}
              <Card radius="xl" className="p-6 bg-white border border-[#E2E8F0] space-y-4">
                <h3 className="font-bold text-base text-[#0F172A] pb-3 border-b border-slate-100 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-[#2563EB]" /> Account Actions
                </h3>

                <Button
                  variant="outline"
                  size="md"
                  className="w-full text-rose-600 border-rose-200 hover:bg-rose-50 font-bold justify-center"
                  leftIcon={<LogOut className="h-4 w-4" />}
                  onClick={() => setIsLogoutModalOpen(true)}
                >
                  Log Out of Session
                </Button>
              </Card>
            </div>
          </div>
        </div>

        {/* Logout Modal */}
        <LogoutModal
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
          onConfirmLogout={handleConfirmLogout}
        />
      </PageContainer>
    </div>
  );
}
