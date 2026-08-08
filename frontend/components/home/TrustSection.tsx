"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Eye, HeartHandshake, Lock } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageContainer } from "@/components/layout/PageContainer";

const TRUST_PILLARS = [
  {
    icon: Lock,
    title: "Privacy-focused",
    description: "Your health information remains private, encrypted, and strictly under your control.",
  },
  {
    icon: Eye,
    title: "Accessible to All",
    description: "Designed for effortless navigation across mobile, tablet, and desktop with high contrast readability.",
  },
  {
    icon: HeartHandshake,
    title: "User-centered Care",
    description: "Every feature is built around patient needs, rapid triage, and intuitive healthcare workflows.",
  },
  {
    icon: ShieldCheck,
    title: "Secure by Design",
    description: "Built with defense-in-depth digital security standards safeguarding your care journey.",
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
      staggerChildren: 0.1,
    },
  },
};

export const TrustSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-100">
      <PageContainer>
        <SectionHeading
          eyebrow="Product Philosophy"
          heading="Built on Trust & Transparency"
          description="We prioritize patient privacy, human-centered accessibility, and enterprise digital safety above all else."
          align="center"
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {TRUST_PILLARS.map((pillar) => {
            const IconComponent = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                variants={fadeInUp}
                className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-blue-200 transition-all space-y-4 text-left"
              >
                <div className="h-12 w-12 rounded-2xl bg-blue-100/80 text-[#2563EB] flex items-center justify-center">
                  <IconComponent className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A]">{pillar.title}</h3>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                  {pillar.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </PageContainer>
    </section>
  );
};
