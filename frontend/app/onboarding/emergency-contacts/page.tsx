"use client";

import React, { useState } from "react";
import { useSafeRouter } from "@/hooks/useSafeRouter";
import { Phone, User, Plus, Trash2, ArrowRight, ArrowLeft } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { ToastContainer, ToastType } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";

export default function OnboardingContactsStepPage() {
  const router = useSafeRouter();
  const { user, addEmergencyContact, deleteEmergencyContact } = useAuth();

  const contacts = user?.emergencyContacts || [];

  const [newName, setNewName] = useState("");
  const [newRelation, setNewRelation] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [toasts, setToasts] = useState<Array<{ id: string; type?: ToastType; title: string; message?: string }>>([]);

  const addToast = (title: string, message?: string, type: ToastType = "error") => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddContact = async () => {
    const trimmedName = newName.trim();
    const trimmedRelation = newRelation.trim() || "Family";
    const trimmedPhone = newPhone.trim();

    if (!trimmedName || !trimmedPhone) {
      addToast("Missing Fields", "Please enter contact name and phone number.", "error");
      return;
    }

    const phoneRegex = /^[0-9+\-\s()]{7,20}$/;
    if (!phoneRegex.test(trimmedPhone)) {
      addToast("Invalid Phone", "Please enter a valid phone number.", "error");
      return;
    }

    try {
      setIsSubmitting(true);
      await addEmergencyContact({
        name: trimmedName,
        relation: trimmedRelation,
        phone: trimmedPhone,
      });
      setNewName("");
      setNewRelation("");
      setNewPhone("");
      addToast("Contact Added", `Added ${trimmedName} to emergency contacts.`, "success");
    } catch (err: any) {
      addToast("Error Adding Contact", err.message || "Failed to add contact.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveContact = async (id: string) => {
    try {
      await deleteEmergencyContact(id);
      addToast("Contact Removed", "Emergency contact was removed.", "info");
    } catch (err: any) {
      addToast("Error Removing Contact", err.message || "Failed to remove contact.", "error");
    }
  };

  const handleNext = () => {
    router.push("/onboarding/preferences");
  };

  return (
    <div className="py-8 lg:py-14 bg-[#F8FAFC] min-h-screen">
      <PageContainer>
        <OnboardingProgress currentStep={2} />

        <div className="max-w-xl mx-auto space-y-6">
          <Card radius="xl" className="p-6 sm:p-8 bg-white border border-[#E2E8F0] shadow-md space-y-6">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-[#0F172A]">Emergency Contacts</h1>
              <p className="text-xs text-[#64748B]">Add someone you trust to be notified in emergency situations.</p>
            </div>

            {/* Existing Contact List */}
            {contacts.length === 0 ? (
              <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-[#64748B]">
                No emergency contacts added yet. Add a contact using the form below.
              </div>
            ) : (
              <div className="space-y-3">
                {contacts.map((c) => {
                  const contactId = c.id || c._id!;
                  return (
                    <div
                      key={contactId}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold text-sm shrink-0">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-[#0F172A]">{c.name}</p>
                          <p className="text-xs text-[#64748B]">{c.phone} · {c.relation || c.relationship}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveContact(contactId)}
                        className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                        aria-label="Remove contact"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add New Contact Form */}
            <div className="p-4 rounded-2xl border border-slate-200 space-y-3 bg-white">
              <h4 className="font-bold text-xs text-[#0F172A]">Add Emergency Contact</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Contact Name *"
                  placeholder="e.g. Father"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <Input
                  label="Relationship *"
                  placeholder="e.g. Parent"
                  value={newRelation}
                  onChange={(e) => setNewRelation(e.target.value)}
                />
              </div>
              <Input
                label="Phone Number *"
                placeholder="+91 98123 45678"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                leftIcon={<Phone className="h-4 w-4" />}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                isLoading={isSubmitting}
                className="w-full font-bold"
                leftIcon={<Plus className="h-4 w-4" />}
                onClick={handleAddContact}
              >
                Add Contact to List
              </Button>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="outline"
                size="md"
                className="flex-1 font-bold"
                leftIcon={<ArrowLeft className="h-4 w-4" />}
                onClick={() => router.push("/onboarding/profile")}
              >
                Back
              </Button>
              <Button
                variant="primary"
                size="md"
                className="flex-1 bg-[#2563EB] hover:bg-blue-700 font-bold"
                rightIcon={<ArrowRight className="h-4 w-4" />}
                onClick={handleNext}
              >
                Next: Preferences
              </Button>
            </div>
          </Card>
        </div>

        <ToastContainer toasts={toasts} onClose={removeToast} />
      </PageContainer>
    </div>
  );
}

