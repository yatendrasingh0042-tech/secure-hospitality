"use client";

import React from "react";
import Link from "next/link";
import { Shield, PhoneCall, Heart, Globe, Share2, Mail, MessageCircle } from "lucide-react";
import { PageContainer } from "./PageContainer";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 mt-auto border-t border-slate-800">
      <PageContainer>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-slate-800">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="h-10 w-10 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-sm">
                <Shield className="h-5 w-5" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">
                Secure<span className="text-[#2563EB]">Hospitality</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Healthcare services made simpler. Empowering patients and healthcare providers with trusted, instant, and secure digital healthcare solutions.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="#social"
                className="h-9 w-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                aria-label="Global Web"
              >
                <Globe className="h-4 w-4" />
              </a>
              <a
                href="#social"
                className="h-9 w-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                aria-label="Share"
              >
                <Share2 className="h-4 w-4" />
              </a>
              <a
                href="#social"
                className="h-9 w-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                aria-label="Mail Support"
              >
                <Mail className="h-4 w-4" />
              </a>
              <a
                href="#social"
                className="h-9 w-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                aria-label="Community"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Platform */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Platform
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="#appointments" className="hover:text-white transition-colors">
                  Appointments
                </Link>
              </li>
              <li>
                <Link href="#medicines" className="hover:text-white transition-colors">
                  Medicines
                </Link>
              </li>
              <li>
                <Link href="#doctors" className="hover:text-white transition-colors">
                  Doctors
                </Link>
              </li>
              <li>
                <Link href="#hospitals" className="hover:text-white transition-colors">
                  Hospitals
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Emergency */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
              <PhoneCall className="h-3.5 w-3.5" /> Emergency
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="#emergency-assistance"
                  className="text-red-300 hover:text-red-200 transition-colors font-medium"
                >
                  Emergency Assistance
                </Link>
              </li>
              <li>
                <Link
                  href="#ambulance-support"
                  className="text-red-300 hover:text-red-200 transition-colors font-medium"
                >
                  Ambulance Support
                </Link>
              </li>
              <li>
                <span className="inline-block mt-2 px-2.5 py-1 rounded bg-red-950/80 border border-red-800/80 text-[11px] text-red-300 font-mono">
                  SOS Hotline: 102 / 911
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Company
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="#about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Secure Hospitality Platform. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="h-3.5 w-3.5 text-[#EF4444] fill-current" /> for patient safety & quality care.
          </p>
        </div>
      </PageContainer>
    </footer>
  );
};
