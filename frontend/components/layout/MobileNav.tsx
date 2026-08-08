"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, PhoneCall, ChevronRight, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface NavItem {
  label: string;
  href: string;
  isEmergency?: boolean;
}

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  items: NavItem[];
  currentPath?: string;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  items,
  currentPath = "/",
}) => {
  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Slide-out Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 260 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-xs sm:max-w-sm bg-white shadow-2xl flex flex-col justify-between p-6 z-10 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <Link
                  href="/"
                  className="flex items-center gap-2.5 group"
                  onClick={onClose}
                >
                  <div className="h-9 w-9 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-sm">
                    <Shield className="h-5 w-5" />
                  </div>
                  <span className="font-bold text-lg text-[#0F172A] tracking-tight">
                    Secure<span className="text-[#2563EB]">Hospitality</span>
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="py-6 space-y-1.5" aria-label="Mobile Navigation">
                {items.map((item) => {
                  const isActive = currentPath === item.href;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center justify-between px-4 py-3.5 rounded-xl font-medium text-base transition-all ${
                        item.isEmergency
                          ? "bg-red-50 text-[#EF4444] hover:bg-red-100/70 border border-red-200/60"
                          : isActive
                          ? "bg-blue-50 text-[#2563EB] font-semibold"
                          : "text-[#0F172A] hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.isEmergency && (
                          <PhoneCall className="h-4 w-4 text-[#EF4444]" />
                        )}
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight
                        className={`h-4 w-4 ${
                          item.isEmergency
                            ? "text-[#EF4444]"
                            : isActive
                            ? "text-[#2563EB]"
                            : "text-slate-400"
                        }`}
                      />
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-slate-100 space-y-3">
              <Button
                variant="outline"
                size="lg"
                className="w-full justify-center"
                leftIcon={<User className="h-4 w-4" />}
                onClick={onClose}
              >
                Sign In
              </Button>
              <Button
                variant="primary"
                size="lg"
                className="w-full justify-center"
                rightIcon={<ArrowRight className="h-4 w-4" />}
                onClick={onClose}
              >
                Get Started
              </Button>
              <p className="text-center text-xs text-[#64748B] pt-2">
                24/7 Secure Healthcare Access
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
