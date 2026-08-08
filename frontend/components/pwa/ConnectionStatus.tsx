"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, CheckCircle2 } from "lucide-react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

export const ConnectionStatus: React.FC = () => {
  const { isOnline } = useOnlineStatus();
  const [showReconnected, setShowReconnected] = useState(false);
  const wasOfflineRef = useRef(false);

  useEffect(() => {
    if (!isOnline) {
      wasOfflineRef.current = true;
    } else if (wasOfflineRef.current && isOnline) {
      setShowReconnected(true);
      const timer = setTimeout(() => {
        setShowReconnected(false);
        wasOfflineRef.current = false;
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 bg-[#EF4444] text-white py-2 px-4 text-center text-xs font-bold shadow-md flex items-center justify-center gap-2"
          role="alert"
          aria-live="assertive"
        >
          <WifiOff className="h-4 w-4" />
          <span>You&apos;re currently offline. Some live features may be limited.</span>
        </motion.div>
      )}

      {isOnline && showReconnected && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 bg-emerald-600 text-white py-2 px-4 text-center text-xs font-bold shadow-md flex items-center justify-center gap-2"
          role="alert"
          aria-live="polite"
        >
          <CheckCircle2 className="h-4 w-4" />
          <span>✓ Back online. Live healthcare services reconnected.</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
