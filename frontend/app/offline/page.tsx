"use client";

import React from "react";
import Link from "next/link";
import { WifiOff, RefreshCw, Siren, ArrowLeft } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function OfflinePage() {
  const handleTryAgain = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <div className="py-16 lg:py-24 bg-[#F8FAFC] min-h-screen flex items-center justify-center">
      <PageContainer>
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="h-20 w-20 rounded-3xl bg-red-100 text-[#EF4444] flex items-center justify-center mx-auto shadow-md">
            <WifiOff className="h-10 w-10" />
          </div>

          <div className="space-y-2">
            <Badge variant="danger" size="sm" showDot className="bg-red-50 text-[#EF4444]">
              No Internet Connection
            </Badge>
            <h1 className="text-3xl font-extrabold text-[#0F172A]">You&apos;re Currently Offline</h1>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              Previously loaded content may still be available. Reconnect to internet or Wi-Fi to access live healthcare booking and marketplace features.
            </p>
          </div>

          <Card radius="xl" className="p-4 bg-red-50/60 border border-red-100 text-left space-y-2 text-xs text-[#EF4444]">
            <div className="flex items-center gap-2 font-bold">
              <Siren className="h-4 w-4 shrink-0" />
              <span>Real Emergency Hotline Notice</span>
            </div>
            <p className="text-[11px] text-red-700 leading-relaxed">
              Emergency assistance request features require an active network connection. If you are experiencing a real medical emergency, call <strong>102 / 108</strong> directly.
            </p>
          </Card>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Button variant="outline" size="md" className="w-full sm:flex-1" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-1" /> Home
              </Link>
            </Button>
            <Button
              variant="primary"
              size="md"
              className="w-full sm:flex-1 bg-[#2563EB]"
              leftIcon={<RefreshCw className="h-4 w-4" />}
              onClick={handleTryAgain}
            >
              Try Again
            </Button>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
