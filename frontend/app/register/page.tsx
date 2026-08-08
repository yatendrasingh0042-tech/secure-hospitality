"use client";

import React, { Suspense } from "react";
import { Shield, HeartPulse } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { RegisterForm } from "@/components/auth/RegisterForm";

function RegisterContent() {
  return (
    <div className="py-8 lg:py-16 bg-[#F8FAFC] min-h-screen flex items-center justify-center">
      <PageContainer>
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 rounded-3xl bg-white border border-[#E2E8F0] shadow-xl overflow-hidden">
          {/* Left Brand Visual (Desktop) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-emerald-600 to-teal-700 p-8 text-white flex flex-col justify-between hidden lg:flex relative overflow-hidden">
            <div className="space-y-6 z-10">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <span className="font-extrabold text-lg tracking-tight">Secure Hospitality</span>
              </div>

              <div className="space-y-2 pt-6">
                <h2 className="text-2xl font-extrabold leading-tight">Start Your Journey</h2>
                <p className="text-sm text-emerald-100 leading-relaxed">
                  Join thousands of patients managing appointments, prescriptions, and emergency care with total peace of mind.
                </p>
              </div>
            </div>

            <div className="z-10 pt-8 border-t border-white/20 text-xs text-emerald-100 flex items-center gap-2">
              <HeartPulse className="h-4 w-4 text-emerald-200" />
              <span>Frontend Identity & Onboarding Prototype</span>
            </div>
          </div>

          {/* Right Register Form */}
          <div className="lg:col-span-7 p-6 sm:p-10 space-y-6">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-[#0F172A]">Create Account</h1>
              <p className="text-xs text-[#64748B]">Fill in your information to set up your account.</p>
            </div>

            <RegisterForm />
          </div>
        </div>
      </PageContainer>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-slate-500">Loading Register...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
