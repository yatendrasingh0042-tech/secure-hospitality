"use client";

import React from "react";
import { motion } from "framer-motion";
import { UserPlus, Search, Calendar, LayoutDashboard } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageContainer } from "@/components/layout/PageContainer";

const STEPS = [
  {
    number: "01",
    title: "Create your profile",
    description: "Setup your secure patient profile with essential medical history and emergency contacts.",
    icon: UserPlus,
  },
  {
    number: "02",
    title: "Choose a service",
    description: "Select doctor consultations, medicine delivery, hospital bed lookup, or emergency SOS.",
    icon: Search,
  },
  {
    number: "03",
    title: "Book / order / request",
    description: "Instantly confirm appointments, order medications, or dispatch emergency assistance.",
    icon: Calendar,
  },
  {
    number: "04",
    title: "Centralized management",
    description: "Track all prescriptions, lab records, upcoming visits, and reminders in one place.",
    icon: LayoutDashboard,
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export const HowItWorks: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-100">
      <PageContainer>
        <SectionHeading
          eyebrow="Simple User Experience"
          heading="How Secure Hospitality Works"
          description="A frictionless, four-step journey designed to connect patients with care in seconds."
          align="center"
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 pt-4"
        >
          {/* Desktop Connecting Line */}
          <div className="hidden lg:block absolute top-1/2 left-12 right-12 h-0.5 bg-slate-200 -translate-y-8 -z-0" />

          {STEPS.map((step) => {
            const IconComponent = step.icon;
            return (
              <motion.div
                key={step.number}
                variants={fadeInUp}
                className="relative z-10 flex flex-col items-center text-center space-y-4 group"
              >
                {/* Step Circle */}
                <div className="relative">
                  <div className="h-16 w-16 rounded-2xl bg-white border-2 border-blue-100 group-hover:border-[#2563EB] text-[#2563EB] shadow-md flex items-center justify-center transition-all group-hover:scale-105">
                    <IconComponent className="h-7 w-7 text-[#2563EB]" />
                  </div>
                  <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-[#2563EB] text-white font-mono text-[10px] font-bold shadow-xs">
                    {step.number}
                  </span>
                </div>

                <div className="space-y-1.5 max-w-xs">
                  <h3 className="text-lg font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </PageContainer>
    </section>
  );
};
