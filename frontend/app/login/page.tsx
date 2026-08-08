"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Shield, Sparkles } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { LoginForm } from "@/components/auth/LoginForm";

function LoginContent() {
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/profile";

  return (
    <div className="py-8 lg:py-16 bg-[#F8FAFC] min-h-screen flex items-center justify-center">
      <PageContainer>
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 rounded-3xl bg-white border border-[#E2E8F0] shadow-xl overflow-hidden">
          {/* Left Brand Visual (Desktop) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#2563EB] to-blue-700 p-8 text-white flex flex-col justify-between hidden lg:flex relative overflow-hidden">
            <div className="space-y-6 z-10">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <span className="font-extrabold text-lg tracking-tight">Secure Hospitality</span>
              </div>

              <div className="space-y-2 pt-6">
                <h2 className="text-2xl font-extrabold leading-tight">Welcome Back</h2>
                <p className="text-sm text-blue-100 leading-relaxed">
                  Access your healthcare appointments, medicine orders, and emergency contact settings securely.
                </p>
              </div>
            </div>

            <div className="z-10 pt-8 border-t border-white/20 text-xs text-blue-100 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-200" />
              <span>Simulated Frontend Identity Flow</span>
            </div>
          </div>

          {/* Right Login Form */}
          <div className="lg:col-span-7 p-6 sm:p-10 space-y-6">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-[#0F172A]">Sign In</h1>
              <p className="text-xs text-[#64748B]">Welcome back! Enter your details to access your account.</p>
            </div>

            <LoginForm onSuccessRedirect={redirectPath} />
          </div>
        </div>
      </PageContainer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-slate-500">Loading Sign In...</div>}>
      <LoginContent />
    </Suspense>
  );
}
