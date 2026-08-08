"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Calendar, Package, Clock, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  icon: "Calendar" | "Package" | "Clock";
  unread: boolean;
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Appointment Reminder",
    message: "Dr. Ananya Sharma consultation scheduled for tomorrow at 10:30 AM.",
    time: "10 mins ago",
    icon: "Calendar",
    unread: true,
  },
  {
    id: "notif-2",
    title: "Medicine Order Packed",
    message: "Order #SH-2026-001 has been packed and assigned for courier dispatch.",
    time: "2 hours ago",
    icon: "Package",
    unread: true,
  },
  {
    id: "notif-3",
    title: "Daily Hydration Reminder",
    message: "Remember to drink 500ml water for your afternoon goal.",
    time: "4 hours ago",
    icon: "Clock",
    unread: false,
  },
];

const iconMap = {
  Calendar: Calendar,
  Package: Package,
  Clock: Clock,
};

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  onClose,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(DEFAULT_NOTIFICATIONS);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs"
          aria-hidden="true"
        />

        {/* Slide-over Drawer */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full max-w-sm bg-white h-full shadow-2xl border-l border-slate-200 z-10 flex flex-col justify-between"
          role="dialog"
          aria-modal="true"
          aria-labelledby="notif-panel-title"
        >
          <div>
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-[#2563EB]" />
                <h3 id="notif-panel-title" className="font-bold text-base text-[#0F172A]">
                  Notifications
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 focus:outline-none"
                aria-label="Close notifications"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Notifications List */}
            <div className="p-4 space-y-3 overflow-y-auto max-h-[calc(100vh-140px)]">
              {notifications.map((n) => {
                const Icon = iconMap[n.icon];
                return (
                  <div
                    key={n.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      n.unread
                        ? "bg-blue-50/50 border-blue-200"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-xl bg-blue-100 text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="space-y-0.5 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-xs text-[#0F172A]">{n.title}</p>
                          <span className="text-[10px] text-slate-400">{n.time}</span>
                        </div>
                        <p className="text-xs text-[#64748B] leading-relaxed">{n.message}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-center"
              leftIcon={<Check className="h-4 w-4" />}
              onClick={handleMarkAllRead}
            >
              Mark all as read
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
