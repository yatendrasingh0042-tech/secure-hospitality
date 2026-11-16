"use client";

import React, { useState } from "react";
import { useSafeRouter } from "@/hooks/useSafeRouter";
import { User, Phone, Mail, HeartHandshake, ShieldCheck, ArrowLeft, Check } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ToastContainer, ToastType } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";

export default function AddEmergencyContactPage() {
  const router = useSafeRouter();
  const { addEmergencyContact } = useAuth();

  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [toasts, setToasts] = useState<Array<{ id: string; type?: ToastType; title: string; message?: string }>>([]);

  const addToast = (title: string, message?: string, type: ToastType = "error") => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedRelation = relation.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) {
      addToast("Required Field", "Please enter contact full name.", "error");
      return;
    }
    if (!trimmedRelation) {
      addToast("Required Field", "Please enter relationship (e.g. Father, Spouse, Friend).", "error");
      return;
    }
    if (!trimmedPhone) {
      addToast("Required Field", "Please enter contact phone number.", "error");
      return;
    }

    const phoneRegex = /^[0-9+\-\s()]{7,20}$/;
    if (!phoneRegex.test(trimmedPhone)) {
      addToast("Invalid Phone", "Please enter a valid phone number (e.g. +91 98765 43210).", "error");
      return;
    }

    try {
      setIsSaving(true);
      await addEmergencyContact({
        name: trimmedName,
        relation: trimmedRelation,
        phone: trimmedPhone,
      });
      setIsSaving(false);
      router.push("/emergency");
    } catch (err: any) {
      setIsSaving(false);
      addToast("Error Saving Contact", err.message || "Failed to add emergency contact. Please try again.", "error");
    }
  };

  return (
    <div className="py-8 lg:py-14 bg-[#F8FAFC] min-h-screen">
      <PageContainer>
        <div className="max-w-xl mx-auto space-y-6">
          <button
            type="button"
            onClick={() => router.push("/emergency")}
            className="flex items-center gap-2 text-xs font-bold text-[#64748B] hover:text-[#0F172A] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Return to Emergency Hub
          </button>

          <Card radius="xl" className="p-6 sm:p-8 bg-white border border-[#E2E8F0] shadow-md space-y-6">
            <div className="space-y-1">
              <h1 className="text-2xl font-extrabold text-[#0F172A]">Add Emergency Contact</h1>
              <p className="text-xs text-[#64748B]">
                Add someone you trust to be notified instantly during emergency situations.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name *"
                placeholder="e.g. Father (Primary)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={<User className="h-4 w-4 text-[#2563EB]" />}
                required
              />

              <Input
                label="Relationship *"
                placeholder="e.g. Parent, Spouse, Sibling, Doctor"
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                leftIcon={<HeartHandshake className="h-4 w-4 text-[#2563EB]" />}
                required
              />

              <Input
                label="Phone Number *"
                placeholder="e.g. +91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                leftIcon={<Phone className="h-4 w-4 text-[#2563EB]" />}
                required
              />

              <Input
                label="Email Address (Optional)"
                type="email"
                placeholder="contact@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="h-4 w-4 text-[#2563EB]" />}
              />

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-xs font-bold text-[#0F172A] block">Primary Emergency Contact</label>
                  <p className="text-[11px] text-[#64748B]">Set as top priority contact during emergency dispatch.</p>
                </div>
                <input
                  type="checkbox"
                  checked={isPrimary}
                  onChange={(e) => setIsPrimary(e.target.checked)}
                  className="h-5 w-5 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => router.push("/emergency")}
                  disabled={isSaving}
                  className="flex-1 font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSaving}
                  leftIcon={!isSaving ? <Check className="h-4 w-4" /> : null}
                  className="flex-1 bg-[#2563EB] hover:bg-blue-700 font-bold"
                >
                  Save Contact
                </Button>
              </div>
            </form>
          </Card>
        </div>

        <ToastContainer toasts={toasts} onClose={removeToast} />
      </PageContainer>
    </div>
  );
}
