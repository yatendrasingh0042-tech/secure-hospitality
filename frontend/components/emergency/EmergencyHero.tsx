"use client";

import React from "react";
import Link from "next/link";
import { Siren, PhoneCall, ShieldAlert, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface EmergencyHeroProps {
  onRequestClick?: () => void;
}

export const EmergencyHero: React.FC<EmergencyHeroProps> = ({ onRequestClick }) => {
  return (
    <Card
      radius="xl"
      className="p-6 sm:p-8 bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-xl border border-red-500/30 relative overflow-hidden"
    >
      {/* Subtle background glow circle */}
      <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-white/5 pointer-events-none" />

      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <Badge variant="danger" size="sm" showDot className="bg-white/20 text-white border-white/30">
            24/7 Emergency Hub
          </Badge>
          <span className="text-xs text-red-100 flex items-center gap-1 font-semibold">
            <PhoneCall className="h-3.5 w-3.5" /> Emergency Hotline: 102 / 108
          </span>
        </div>

        <div className="space-y-2 max-w-xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <Siren className="h-8 w-8 text-red-200 shrink-0" />
            Emergency Medical Assistance
          </h2>
          <p className="text-sm sm:text-base text-red-100 leading-relaxed">
            Get help when you need it most. Request urgent ambulance dispatch, locate nearest 24/7 emergency care, or notify emergency contacts.
          </p>
        </div>

        {/* Primary Action Button (Two-Step Safety Flow) */}
        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Button
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto bg-white text-[#EF4444] hover:bg-red-50 font-extrabold shadow-lg"
            onClick={onRequestClick}
            asChild={!onRequestClick}
          >
            {onRequestClick ? (
              <button type="button" className="flex items-center gap-2">
                <span>Request Assistance</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <Link href="/emergency/confirm">
                <span>Request Assistance</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </Button>

          {/* Safety disclaimer badge */}
          <div className="p-2.5 rounded-xl bg-black/20 border border-white/10 text-[11px] text-red-100 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-red-200 shrink-0" />
            <span>Frontend Prototype — Does not call real emergency services.</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
