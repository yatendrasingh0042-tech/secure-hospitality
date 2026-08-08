"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { Clock, Plus, ArrowLeft } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { ReminderCard } from "@/components/reminders/ReminderCard";
import { useReminders, ReminderType, RepeatOption } from "@/context/ReminderContext";

function RemindersContent() {
  const { reminders, createReminder } = useReminders();
  const [filterType, setFilterType] = useState<string>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [type, setType] = useState<ReminderType>("Medication");
  const [time, setTime] = useState("09:00 AM");
  const [repeat, setRepeat] = useState<RepeatOption>("Daily");
  const [notes, setNotes] = useState("");

  const filtered = reminders.filter((r) => filterType === "All" || r.type === filterType);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    createReminder({
      title,
      type,
      time,
      repeat,
      enabled: true,
      notes,
    });
    setTitle("");
    setNotes("");
    setIsModalOpen(false);
  };

  return (
    <div className="py-8 lg:py-14 bg-[#F8FAFC] min-h-screen">
      <PageContainer>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#0F172A]"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setIsModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Create Reminder
            </Button>
          </div>

          {/* Header */}
          <div className="space-y-1">
            <Badge variant="info" size="sm" showDot className="bg-purple-50 text-purple-600 border-purple-200">
              Personal Schedule
            </Badge>
            <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Health & Medicine Reminders
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Configure daily medication alerts, hydration schedules, and appointment notifications.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {["All", "Medication", "Appointment", "Health", "General"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  filterType === t
                    ? "bg-purple-600 text-white shadow-xs"
                    : "bg-white border border-slate-200 text-[#64748B] hover:bg-slate-100"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Reminders Grid */}
          {filtered.length === 0 ? (
            <Card radius="xl" className="p-8 text-center bg-white border border-[#E2E8F0] space-y-3">
              <Clock className="h-10 w-10 text-slate-300 mx-auto" />
              <h4 className="font-bold text-[#0F172A]">No reminders found</h4>
              <p className="text-xs text-[#64748B]">Create your first reminder to stay on top of your health regimen.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((rem) => (
                <ReminderCard key={rem.id} reminder={rem} />
              ))}
            </div>
          )}
        </div>

        {/* Create Reminder Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
            <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 z-10 space-y-4">
              <h3 className="font-bold text-lg text-[#0F172A]">Create Health Reminder</h3>

              <form onSubmit={handleCreate} className="space-y-3 text-xs">
                <Input
                  label="Reminder Title *"
                  placeholder="e.g. Calcium Supplement"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-[#0F172A]">Category</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as ReminderType)}
                      className="w-full rounded-xl border border-slate-200 p-2.5 bg-white font-semibold"
                    >
                      <option value="Medication">Medication</option>
                      <option value="Appointment">Appointment</option>
                      <option value="Health">Health</option>
                      <option value="General">General</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-[#0F172A]">Repeat</label>
                    <select
                      value={repeat}
                      onChange={(e) => setRepeat(e.target.value as RepeatOption)}
                      className="w-full rounded-xl border border-slate-200 p-2.5 bg-white font-semibold"
                    >
                      <option value="Once">Once</option>
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Custom">Custom</option>
                    </select>
                  </div>
                </div>

                <Input
                  label="Scheduled Time"
                  placeholder="e.g. 09:00 AM"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />

                <Input
                  label="Notes / Instructions"
                  placeholder="Take with water after meals"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />

                <div className="flex items-center gap-3 pt-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700">
                    Save Reminder
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </PageContainer>
    </div>
  );
}

export default function RemindersPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-slate-500">Loading Reminders...</div>}>
      <RemindersContent />
    </Suspense>
  );
}
