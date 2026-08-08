"use client";

import React from "react";
import { Siren, MapPin, Navigation } from "lucide-react";

interface TrackingMapProps {
  vehicleName: string;
  estimatedArrival: string;
}

export const TrackingMap: React.FC<TrackingMapProps> = ({
  vehicleName,
  estimatedArrival,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-xs uppercase tracking-wider text-[#0F172A] flex items-center gap-1.5">
          <Navigation className="h-4 w-4 text-[#2563EB]" /> Live Tracking Diagram (Simulated)
        </h4>
        <span className="text-xs font-bold text-[#EF4444]">{estimatedArrival} away</span>
      </div>

      {/* Stylized Canvas Diagram */}
      <div className="relative h-56 w-full rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border border-slate-700 overflow-hidden flex flex-col justify-between p-6 shadow-inner">
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none" />

        {/* Top Vehicle Indicator */}
        <div className="relative z-10 flex items-center gap-3 bg-red-950/80 backdrop-blur-xs p-2.5 rounded-xl border border-red-500/40 max-w-xs animate-pulse">
          <div className="h-8 w-8 rounded-lg bg-[#EF4444] text-white flex items-center justify-center shrink-0">
            <Siren className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">{vehicleName}</p>
            <p className="text-[10px] text-red-200">En Route · Dispatch Unit 04</p>
          </div>
        </div>

        {/* Connecting route line graphic */}
        <div className="relative z-10 my-auto py-2">
          <div className="h-1 w-full bg-slate-700 rounded-full relative overflow-hidden">
            <div className="h-full bg-gradient-to-r from-red-500 via-blue-500 to-emerald-500 w-3/4 rounded-full transition-all duration-1000" />
          </div>
        </div>

        {/* Bottom Destination Pin Indicator */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-700">
            <MapPin className="h-4 w-4 text-[#10B981]" />
            <span className="text-xs font-semibold text-white">Patient Location (Daulatabad)</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">MAP-SIM-849</span>
        </div>
      </div>
    </div>
  );
};
