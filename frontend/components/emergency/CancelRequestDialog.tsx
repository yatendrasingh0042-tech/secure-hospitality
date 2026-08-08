"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface CancelRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmCancel: () => void;
}

export const CancelRequestDialog: React.FC<CancelRequestDialogProps> = ({
  isOpen,
  onClose,
  onConfirmCancel,
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
          className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 z-10 space-y-5 text-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-dialog-title"
        >
          <div className="h-14 w-14 rounded-2xl bg-red-100 text-[#EF4444] flex items-center justify-center mx-auto">
            <AlertTriangle className="h-7 w-7" />
          </div>

          <div className="space-y-2">
            <h3 id="cancel-dialog-title" className="text-xl font-bold text-[#0F172A]">
              Cancel Emergency Assistance?
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Are you sure you want to cancel this simulated emergency request? Your assigned provider status will be reset.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Button
              variant="outline"
              size="md"
              className="w-full sm:flex-1"
              onClick={onClose}
            >
              Keep Request
            </Button>
            <Button
              variant="danger"
              size="md"
              className="w-full sm:flex-1 bg-[#EF4444] text-white"
              onClick={() => {
                onConfirmCancel();
                onClose();
              }}
            >
              Confirm Cancellation
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
