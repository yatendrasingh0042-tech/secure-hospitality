"use client";

import React, { createContext, useContext, useState, useMemo, useCallback } from "react";

export type ReminderType = "Medication" | "Appointment" | "Health" | "General";
export type RepeatOption = "Once" | "Daily" | "Weekly" | "Custom";

export interface Reminder {
  id: string;
  title: string;
  type: ReminderType;
  time: string;
  repeat: RepeatOption;
  enabled: boolean;
  notes?: string;
}

interface ReminderContextType {
  reminders: Reminder[];
  createReminder: (data: Omit<Reminder, "id">) => void;
  updateReminder: (id: string, data: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  toggleReminder: (id: string) => void;
}

const DEFAULT_REMINDERS: Reminder[] = [
  {
    id: "rem-1",
    title: "Vitamin D3 Supplement",
    type: "Medication",
    time: "09:00 AM",
    repeat: "Daily",
    enabled: true,
    notes: "Take 1 tablet after breakfast with water.",
  },
  {
    id: "rem-2",
    title: "Dr. Ananya Cardiology Checkup",
    type: "Appointment",
    time: "10:30 AM",
    repeat: "Once",
    enabled: true,
    notes: "City Care Hospital, OPD Room 402.",
  },
  {
    id: "rem-3",
    title: "Hydration & Posture Check",
    type: "Health",
    time: "02:00 PM",
    repeat: "Daily",
    enabled: true,
    notes: "Drink 500ml water and stretch for 5 mins.",
  },
  {
    id: "rem-4",
    title: "Evening BP Check",
    type: "Health",
    time: "07:30 PM",
    repeat: "Daily",
    enabled: false,
    notes: "Record blood pressure reading in journal.",
  },
];

const ReminderContext = createContext<ReminderContextType | undefined>(undefined);

export const ReminderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reminders, setReminders] = useState<Reminder[]>(DEFAULT_REMINDERS);

  const createReminder = useCallback((data: Omit<Reminder, "id">) => {
    const newRem: Reminder = {
      ...data,
      id: `rem-${Date.now()}`,
    };
    setReminders((prev) => [newRem, ...prev]);
  }, []);

  const updateReminder = useCallback((id: string, data: Partial<Reminder>) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...data } : r))
    );
  }, []);

  const deleteReminder = useCallback((id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const toggleReminder = useCallback((id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  }, []);

  const value = useMemo(
    () => ({
      reminders,
      createReminder,
      updateReminder,
      deleteReminder,
      toggleReminder,
    }),
    [reminders, createReminder, updateReminder, deleteReminder, toggleReminder]
  );

  return (
    <ReminderContext.Provider value={value}>
      {children}
    </ReminderContext.Provider>
  );
};

export const useReminders = () => {
  const context = useContext(ReminderContext);
  if (!context) {
    throw new Error("useReminders must be used within a ReminderProvider");
  }
  return context;
};
