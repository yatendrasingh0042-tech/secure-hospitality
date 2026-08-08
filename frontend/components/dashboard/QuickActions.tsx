"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Pill, Siren, FileText, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";

export const QuickActions: React.FC = () => {
  const actions = [
    {
      title: "Book Appointment",
      desc: "Find doctors & select time slots",
      href: "/appointments",
      icon: Calendar,
      bgColor: "bg-blue-50 text-[#2563EB]",
      borderColor: "hover:border-blue-300",
    },
    {
      title: "Order Medicines",
      desc: "OTC & Rx health marketplace",
      href: "/medicines",
      icon: Pill,
      bgColor: "bg-emerald-50 text-emerald-600",
      borderColor: "hover:border-emerald-300",
    },
    {
      title: "Emergency Care",
      desc: "Urgent dispatch & ER guidance",
      href: "/emergency",
      icon: Siren,
      bgColor: "bg-red-50 text-[#EF4444]",
      borderColor: "hover:border-red-300",
    },
    {
      title: "Health Records",
      desc: "Prescriptions & lab reports",
      href: "/health-records",
      icon: FileText,
      bgColor: "bg-purple-50 text-purple-600",
      borderColor: "hover:border-purple-300",
    },
  ];

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-xs uppercase tracking-wider text-[#0F172A]">
        Quick Actions
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <Link key={act.title} href={act.href} className="group focus:outline-none">
              <Card
                radius="xl"
                className={`p-4 bg-white border border-[#E2E8F0] transition-all hover:shadow-md ${act.borderColor} space-y-3`}
              >
                <div className="flex items-center justify-between">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold ${act.bgColor}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-[#0F172A] group-hover:translate-x-0.5 transition-all" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#0F172A]">{act.title}</h4>
                  <p className="text-xs text-[#64748B] mt-0.5">{act.desc}</p>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
