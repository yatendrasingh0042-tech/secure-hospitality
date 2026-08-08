"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Fallback demo user if unauthenticated
  const displayUser = user || {
    id: "usr-94820",
    firstName: "Yatendra",
    lastName: "Singh",
    email: "yatendra@example.com",
    phone: "+91 98765 43210",
    dateOfBirth: "1994-08-15",
    gender: "Male",
    city: "Central City",
    state: "Haryana",
    emergencyContacts: [
      { id: "cnt-1", name: "Mother (Primary)", relation: "Parent", phone: "+91 98765 43210" },
      { id: "cnt-2", name: "Father", relation: "Parent", phone: "+91 98123 45678" },
    ],
    preferences: {
      consultationType: "both",
      appointmentReminders: true,
      medicineReminders: true,
      orderUpdates: true,
      emergencyAlerts: true,
    },
    onboardingCompleted: true,
  };

  const handleConfirmLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="py-8 lg:py-14 bg-[#F8FAFC] min-h-screen">
      <PageContainer>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Header Banner */}
          <Card radius="xl" className="p-6 sm:p-8 bg-white border border-[#E2E8F0] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="h-20 w-20 rounded-3xl bg-[#2563EB] text-white font-extrabold text-2xl flex items-center justify-center shadow-lg">
                  {displayUser.firstName[0]}
                  {displayUser.lastName[0]}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h1 className="text-2xl font-extrabold text-[#0F172A]">
                      {displayUser.firstName} {displayUser.lastName}
                    </h1>
                    <Badge variant="success" size="sm" showDot>
                      Demo Account
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
                    <span className="text-[#64748B] block font-medium">Location</span>
                    <span className="font-bold text-[#0F172A]">{displayUser.city}, {displayUser.state}</span>
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
