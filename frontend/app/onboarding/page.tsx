"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, UserCheck } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function OnboardingIntroPage() {
  return (
    <div className="py-12 lg:py-20 bg-[#F8FAFC] min-h-screen flex items-center justify-center">
      <PageContainer>
        <div className="max-w-xl mx-auto text-center space-y-6">
          <Badge variant="info" size="sm" showDot className="bg-blue-50 text-[#2563EB]">
            Step 1 of 3 · Setup Guide
          </Badge>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              Let&apos;s set up your healthcare experience
            </h1>
            <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
              A few details will help personalize your Secure Hospitality experience, from emergency contact alerts to appointment preferences.
            </p>
          </div>

          <Card radius="xl" className="p-6 bg-white border border-[#E2E8F0] shadow-sm space-y-4 text-left">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold text-sm shrink-0">
                <UserCheck className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-[#0F172A]">Privacy-First Setup</h4>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Your preferences help personalize your experience. You can easily modify your information later from your profile settings.
                </p>
              </div>
            </div>
          </Card>

          <div className="pt-4">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto bg-[#2563EB] hover:bg-blue-700 font-bold px-8"
              rightIcon={<ArrowRight className="h-4 w-4" />}
              asChild
            >
              <Link href="/onboarding/profile">Get Started</Link>
            </Button>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
