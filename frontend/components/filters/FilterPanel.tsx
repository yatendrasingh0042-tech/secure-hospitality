"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface FilterPanelProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onReset: () => void;
  children: React.ReactNode;
  activeCount: number;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpenMobile,
  onCloseMobile,
  onReset,
  children,
  activeCount,
}) => {
  // Prevent body scroll when mobile filter sheet is open
  useEffect(() => {
    if (isOpenMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpenMobile]);

  return (
    <>
      {/* Desktop Sidebar View */}
      <aside className="hidden lg:block w-72 shrink-0 space-y-6 bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs self-start sticky top-24">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="font-bold text-base text-[#0F172A]">Filters</h3>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={onReset}
              className="text-xs font-semibold text-[#EF4444] hover:underline flex items-center gap-1 focus-visible:outline-none"
            >
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
          )}
        </div>
        <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-1 scrollbar-none">
          {children}
        </div>
      </aside>

      {/* Mobile Bottom Sheet Modal */}
      <AnimatePresence>
        {isOpenMobile && (
          <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs"
              aria-hidden="true"
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 260 }}
              className="relative w-full max-h-[85vh] bg-white rounded-t-3xl p-6 shadow-2xl z-10 flex flex-col justify-between overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Filter Options"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg text-[#0F172A]">Filters</h3>
                  {activeCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[#2563EB] text-xs font-bold">
                      {activeCount} active
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={onCloseMobile}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="py-4 overflow-y-auto space-y-4 flex-1">
                {children}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-3 shrink-0">
                <Button variant="outline" size="md" className="flex-1" onClick={onReset}>
                  Reset
                </Button>
                <Button variant="primary" size="md" className="flex-1" onClick={onCloseMobile}>
                  Apply Filters
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
