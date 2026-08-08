"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Share, PlusSquare, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useStandaloneMode } from "@/hooks/useStandaloneMode";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const InstallAppPrompt: React.FC = () => {
  const { isStandalone } = useStandaloneMode();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showIosInstructions, setShowIosInstructions] = useState(false);

  const [isIos] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === "undefined" || isStandalone) return;

    // Listen for Android / Chrome beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // If iOS Safari, show prompt once if not dismissed
    if (isIos && !localStorage.getItem("pwa_ios_prompt_dismissed")) {
      const timer = setTimeout(() => setShowPrompt(true), 3000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, [isStandalone, isIos]);

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosInstructions(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    if (isIos) {
      localStorage.setItem("pwa_ios_prompt_dismissed", "true");
    }
  };

  if (isStandalone || !showPrompt) return null;

  return (
    <AnimatePresence>
      {/* Floating Bottom Banner */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-20 lg:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-slate-900 text-white p-4 rounded-3xl shadow-2xl border border-slate-800 space-y-3"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#2563EB] text-white flex items-center justify-center font-bold text-sm shrink-0">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Install Secure Hospitality</h4>
              <p className="text-xs text-slate-300">Get faster access from your home screen.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDismiss}
            className="text-slate-400 hover:text-white p-1 rounded-full"
            aria-label="Dismiss prompt"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <Button variant="outline" size="sm" className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800" onClick={handleDismiss}>
            Not Now
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="flex-1 bg-[#2563EB] hover:bg-blue-600 font-bold"
            leftIcon={<Download className="h-4 w-4" />}
            onClick={handleInstallClick}
          >
            Install App
          </Button>
        </div>
      </motion.div>

      {/* iOS Instructional Modal */}
      {showIosInstructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={() => setShowIosInstructions(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 z-10 space-y-4 text-center">
            <h3 className="font-bold text-lg text-[#0F172A]">Install on iPhone</h3>
            <p className="text-xs text-[#64748B]">Follow these steps to add Secure Hospitality to your home screen:</p>

            <div className="space-y-3 text-left text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-full bg-blue-100 text-[#2563EB] font-bold flex items-center justify-center shrink-0">
                  1
                </div>
                <p className="flex items-center gap-1 font-semibold text-[#0F172A]">
                  Tap the <Share className="h-4 w-4 text-[#2563EB]" /> Share button in Safari
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-full bg-blue-100 text-[#2563EB] font-bold flex items-center justify-center shrink-0">
                  2
                </div>
                <p className="flex items-center gap-1 font-semibold text-[#0F172A]">
                  Choose <PlusSquare className="h-4 w-4 text-[#2563EB]" /> Add to Home Screen
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-full bg-blue-100 text-[#2563EB] font-bold flex items-center justify-center shrink-0">
                  3
                </div>
                <p className="font-semibold text-[#0F172A]">Tap Add in the top right corner</p>
              </div>
            </div>

            <Button variant="primary" size="sm" className="w-full bg-[#2563EB]" onClick={() => setShowIosInstructions(false)}>
              Got It
            </Button>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
