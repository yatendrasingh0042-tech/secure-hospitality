"use client";

import React from "react";
import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function NotFound() {
  return (
    <div className="py-16 lg:py-24 bg-[#F8FAFC] min-h-screen flex items-center justify-center">
      <PageContainer>
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="h-20 w-20 rounded-3xl bg-blue-100 text-[#2563EB] flex items-center justify-center mx-auto shadow-md">
            <FileQuestion className="h-10 w-10" />
          </div>

          <div className="space-y-2">
            <Badge variant="info" size="sm" showDot>
              Error 404
            </Badge>
            <h1 className="text-3xl font-extrabold text-[#0F172A]">Page Not Found</h1>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              The page you are looking for might have been moved, removed, or is temporarily unavailable.
            </p>
          </div>

          <div className="pt-2">
            <Button variant="primary" size="md" className="bg-[#2563EB]" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-1" /> Return Home
              </Link>
            </Button>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
