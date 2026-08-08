"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UploadCloud, CheckCircle2, ShieldAlert } from "lucide-react";

import { Medicine } from "@/types/medicine";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useCart } from "@/context/CartContext";

interface PrescriptionModalProps {
  medicine: Medicine | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PrescriptionModal: React.FC<PrescriptionModalProps> = ({
  medicine,
  isOpen,
  onClose,
}) => {
  const { addItem } = useCart();
  const [uploaded, setUploaded] = useState(false);

  if (!isOpen || !medicine) return null;

  const handleSimulatedUpload = () => {
    setUploaded(true);
    setTimeout(() => {
      addItem(medicine, 1);
      setUploaded(false);
      onClose();
    }, 1200);
  };

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

        {/* Modal Dialog */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100 z-10 space-y-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="rx-modal-title"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <Badge variant="warning" size="sm" showDot>
                Prescription Required
              </Badge>
              <h3 id="rx-modal-title" className="text-xl font-bold text-[#0F172A]">
                Upload Doctor&apos;s Prescription
              </h3>
              <p className="text-xs text-[#64748B]">
                {medicine.name} requires a valid medical prescription before order placement.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Upload Zone Simulation */}
          <div
            onClick={handleSimulatedUpload}
            className="p-8 rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/50 hover:bg-blue-50 transition-colors cursor-pointer text-center space-y-3"
          >
            <div className="h-12 w-12 rounded-2xl bg-white text-[#2563EB] flex items-center justify-center mx-auto shadow-2xs">
              <UploadCloud className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#0F172A]">Click or Drag & Drop Prescription</p>
              <p className="text-xs text-[#64748B] mt-0.5">Supports PDF, JPG, PNG (Max 5MB)</p>
            </div>
          </div>

          {uploaded && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
              <span>Simulated Rx verification complete! Adding item to cart...</span>
            </div>
          )}

          {/* Educational Disclaimer */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-[#64748B] flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-slate-400 shrink-0" />
            <span>Demo prescription workflow — No file is uploaded to servers or medically verified.</span>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSimulatedUpload}>
              Simulate Upload & Add
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
