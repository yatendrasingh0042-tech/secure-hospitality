"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Siren, PhoneCall, MapPin, AlertTriangle, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  const [selectedType, setSelectedType] = useState<string>("ambulance");
  const [dispatchStatus, setDispatchStatus] = useState<"idle" | "requesting" | "dispatched">("idle");

  const handleSimulateRequest = () => {
    setDispatchStatus("requesting");
    setTimeout(() => {
      setDispatchStatus("dispatched");
    }, 1500);
  };

  const handleReset = () => {
    setDispatchStatus("idle");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-red-200 p-6 sm:p-8 z-10 overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Emergency Medical Support Interface"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-red-100 text-[#EF4444] flex items-center justify-center">
                  <Siren className="h-6 w-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0F172A]">Emergency Support</h3>
                  <p className="text-xs text-[#64748B]">Frontend Assistance Preview</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            {dispatchStatus === "idle" && (
              <div className="py-5 space-y-5">
                <div className="p-3.5 rounded-2xl bg-red-50/80 border border-red-200/80 flex items-center gap-3 text-xs text-red-800">
                  <AlertTriangle className="h-4 w-4 text-[#EF4444] shrink-0" />
                  <span>
                    If this is a life-threatening emergency, please dial local emergency services (911 / 102) immediately.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-2.5">
                    Select Emergency Category
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setSelectedType("ambulance")}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedType === "ambulance"
                          ? "border-[#EF4444] bg-red-50 text-[#EF4444] font-semibold"
                          : "border-slate-200 hover:border-slate-300 text-slate-700"
                      }`}
                    >
                      <p className="text-xs font-bold">Ambulance</p>
                      <p className="text-[10px] text-slate-500">Dispatch request</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedType("triage")}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedType === "triage"
                          ? "border-[#EF4444] bg-red-50 text-[#EF4444] font-semibold"
                          : "border-slate-200 hover:border-slate-300 text-slate-700"
                      }`}
                    >
                      <p className="text-xs font-bold">Doctor SOS</p>
                      <p className="text-[10px] text-slate-500">Urgent callback</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedType("poison")}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedType === "poison"
                          ? "border-[#EF4444] bg-red-50 text-[#EF4444] font-semibold"
                          : "border-slate-200 hover:border-slate-300 text-slate-700"
                      }`}
                    >
                      <p className="text-xs font-bold">Poison / Trauma</p>
                      <p className="text-[10px] text-slate-500">Immediate guidance</p>
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-[#64748B] flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-[#2563EB]" /> Mock Location Detected:
                    </span>
                    <Badge variant="neutral" size="sm">
                      Sector 4, Central District
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs font-medium pt-1">
                    <span className="text-[#64748B] flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-[#10B981]" /> Nearest Hospital:
                    </span>
                    <span className="text-[#0F172A] font-semibold">SecureCare Center (1.8 km)</span>
                  </div>
                </div>

                <Button
                  variant="danger"
                  size="lg"
                  className="w-full justify-center"
                  leftIcon={<PhoneCall className="h-4 w-4" />}
                  onClick={handleSimulateRequest}
                >
                  Simulate Emergency Request
                </Button>
              </div>
            )}

            {dispatchStatus === "requesting" && (
              <div className="py-12 text-center space-y-4">
                <div className="h-12 w-12 rounded-full border-4 border-red-200 border-t-[#EF4444] animate-spin mx-auto" />
                <h4 className="text-lg font-bold text-[#0F172A]">Connecting Emergency Responders...</h4>
                <p className="text-xs text-[#64748B]">Simulating mock dispatch sequence</p>
              </div>
            )}

            {dispatchStatus === "dispatched" && (
              <div className="py-6 text-center space-y-4">
                <div className="h-14 w-14 rounded-full bg-emerald-100 text-[#10B981] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#0F172A]">Emergency Assistance Simulated</h4>
                  <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
                    This is a frontend demonstration. In a production release, your request will alert nearest verified emergency units.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#0F172A] font-mono text-center">
                  Mock Reference Ticket: #EMG-84920
                </div>

                <Button variant="primary" size="md" className="w-full" onClick={handleReset}>
                  Close Preview
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
