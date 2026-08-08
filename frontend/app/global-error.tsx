"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <PageContainer>
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="h-20 w-20 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-md">
              <AlertTriangle className="h-10 w-10" />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold text-[#0F172A]">Something Went Wrong</h1>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                We encountered an unexpected error while loading this page. Please try refreshing or return to the main dashboard.
              </p>
            </div>

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
                onClick={() => reset()}
              >
                Try Again
              </Button>
            </div>
          </div>
        </PageContainer>
      </body>
    </html>
  );
}
