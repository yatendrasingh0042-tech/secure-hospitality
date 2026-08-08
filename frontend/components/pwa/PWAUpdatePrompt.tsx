"use client";

import React, { useState, useEffect } from "react";
import { RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const PWAUpdatePrompt: React.FC = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                setUpdateAvailable(true);
                setRegistration(reg);
              }
            });
          }
        });
      });
    }
  }, []);

  const handleUpdate = () => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
    }
    window.location.reload();
  };

  if (!updateAvailable) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-6 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-sm z-50 bg-[#0F172A] text-white p-4 rounded-2xl shadow-xl border border-slate-700 space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-bold text-xs flex items-center gap-1.5">
          <RefreshCw className="h-4 w-4 text-[#2563EB] animate-spin" /> New Version Available
        </span>
        <button type="button" onClick={() => setUpdateAvailable(false)} className="text-slate-400 hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>
      <p className="text-xs text-slate-300">Update Secure Hospitality to get the latest performance improvements.</p>
      <Button variant="primary" size="sm" className="w-full bg-[#2563EB]" onClick={handleUpdate}>
        Update App Now
      </Button>
    </div>
  );
};
