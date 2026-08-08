"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  CalendarCheck,
  Pill,
  Building2,
  Siren,
  FileText,
  Bell,
  ArrowUpRight,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageContainer } from "@/components/layout/PageContainer";
import { SERVICES_DATA, ServiceItem } from "@/data/services";

interface QuickServicesProps {
  onSelectService?: (serviceId: string) => void;
}

const iconMap = {
  CalendarCheck: CalendarCheck,
  Pill: Pill,
  Building2: Building2,
  Siren: Siren,
  FileText: FileText,
  Bell: Bell,
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export const QuickServices: React.FC<QuickServicesProps> = ({ onSelectService }) => {
  return (
    <section id="services" className="py-16 sm:py-24 bg-white border-b border-slate-100">
      <PageContainer>
        <SectionHeading
          eyebrow="Integrated Care Platform"
          heading="What do you need today?"
          description="Access six core healthcare pillars designed with Apple-level simplicity, rapid response, and complete privacy."
          align="center"
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {SERVICES_DATA.map((service: ServiceItem) => {
            const IconComponent = iconMap[service.iconName];

            return (
              <motion.div key={service.id} variants={fadeInUp}>
                <a
                  href={service.href}
                  onClick={(e) => {
                    if (onSelectService) {
                      e.preventDefault();
                      onSelectService(service.id);
                    }
                  }}
                  className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded-2xl group"
                >
                  <Card
                    variant="interactive"
                    radius="xl"
                    className="h-full flex flex-col justify-between p-6 sm:p-7 border border-[#E2E8F0] group-hover:border-blue-200 transition-all duration-300"
                  >
                    <CardHeader className="p-0 mb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                            service.id === "emergency"
                              ? "bg-red-50 text-[#EF4444] border border-red-100"
                              : service.id === "medicines"
                              ? "bg-emerald-50 text-[#10B981] border border-emerald-100"
                              : service.id === "hospitals"
                              ? "bg-indigo-50 text-indigo-600 border border-indigo-100"
                              : service.id === "medication-reminders"
                              ? "bg-amber-50 text-[#F59E0B] border border-amber-100"
                              : "bg-blue-50 text-[#2563EB] border border-blue-100"
                          }`}
                        >
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <Badge variant={service.badgeVariant} size="sm">
                          {service.badge}
                        </Badge>
                      </div>

                      <CardTitle className="text-xl font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                        {service.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-[#64748B] leading-relaxed mt-1.5">
                        {service.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="p-0 pt-4 flex items-center justify-between border-t border-slate-100 text-sm font-semibold text-[#0F172A] group-hover:text-[#2563EB]">
                      <span>{service.actionText}</span>
                      <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-[#2563EB] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </CardContent>
                  </Card>
                </a>
              </motion.div>
            );
          })}
        </motion.div>
      </PageContainer>
    </section>
  );
};
