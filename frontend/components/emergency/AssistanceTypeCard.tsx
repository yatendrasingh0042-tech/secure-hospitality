"use client";

import React from "react";
import { Siren, Building2, PhoneCall, Check } from "lucide-react";
import { AssistanceType } from "@/context/EmergencyContext";

interface AssistanceTypeCardProps {
  type: AssistanceType;
  title: string;
  description: string;
  icon: "Siren" | "Building2" | "PhoneCall";
  isSelected: boolean;
  onSelect: (type: AssistanceType) => void;
}

const iconMap = {
  Siren: Siren,
  Building2: Building2,
  PhoneCall: PhoneCall,
};

export const AssistanceTypeCard: React.FC<AssistanceTypeCardProps> = ({
  type,
  title,
  description,
  icon,
  isSelected,
  onSelect,
}) => {
  const Icon = iconMap[icon];

  return (
    <div
      onClick={() => onSelect(type)}
      className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EF4444] ${
        isSelected
          ? "bg-red-50/80 border-[#EF4444] ring-2 ring-[#EF4444]"
          : "bg-white border-[#E2E8F0] hover:border-red-200 hover:bg-slate-50"
      }`}
    >
      <div className="flex items-center justify-between">
        <div
          className={`h-11 w-11 rounded-xl flex items-center justify-center ${
            isSelected ? "bg-[#EF4444] text-white" : "bg-red-100 text-[#EF4444]"
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>
        {isSelected && <Check className="h-5 w-5 text-[#EF4444]" />}
      </div>

      <div>
        <h4 className="font-bold text-sm text-[#0F172A]">{title}</h4>
        <p className="text-xs text-[#64748B] mt-1 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};
