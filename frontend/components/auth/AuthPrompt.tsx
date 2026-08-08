"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AuthPromptProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export const AuthPrompt: React.FC<AuthPromptProps> = ({
  isOpen,
  onClose,
  title = "Sign in to continue",
  description = "Create an account or sign in to manage appointments, medicine orders, and emergency healthcare preferences.",
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs"
          aria-hidden="true"
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 z-10 space-y-6 text-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-prompt-title"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 rounded-full p-1 focus:outline-none"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="h-14 w-14 rounded-2xl bg-blue-100 text-[#2563EB] flex items-center justify-center mx-auto">
            <Shield className="h-7 w-7" />
          </div>

          <div className="space-y-2">
            <h3 id="auth-prompt-title" className="text-xl font-bold text-[#0F172A]">
              {title}
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed">{description}</p>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Button variant="primary" size="md" className="w-full bg-[#2563EB] hover:bg-blue-700" asChild>
              <Link href="/login">
                <span>Sign In</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
            <Button variant="outline" size="md" className="w-full" asChild>
              <Link href="/register">Create Account</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
