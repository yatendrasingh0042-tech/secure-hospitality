"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  id: string;
  type?: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  type = "success",
  title,
  message,
  duration = 4000,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />,
    info: <Info className="h-5 w-5 text-blue-600 shrink-0" />,
  };

  const borderColors = {
    success: "border-emerald-200 bg-emerald-50/90 text-emerald-950",
    error: "border-red-200 bg-red-50/90 text-red-950",
    info: "border-blue-200 bg-blue-50/90 text-blue-950",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className={`p-4 rounded-2xl border shadow-lg backdrop-blur-xs max-w-sm w-full flex items-start gap-3 ${borderColors[type]}`}
      role="status"
      aria-live="polite"
    >
      {icons[type]}
      <div className="flex-1 space-y-0.5">
        <h5 className="font-bold text-xs leading-snug">{title}</h5>
        {message && <p className="text-[11px] opacity-80 leading-relaxed">{message}</p>}
      </div>
      <button
        type="button"
        onClick={() => onClose(id)}
        className="opacity-60 hover:opacity-100 p-0.5 rounded-md focus:outline-hidden"
        aria-label="Close notification"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  );
};

export const ToastContainer: React.FC<{
  toasts: Array<{ id: string; type?: ToastType; title: string; message?: string }>;
  onClose: (id: string) => void;
}> = ({ toasts, onClose }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-2 flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast {...toast} onClose={onClose} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};
