"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, User, Plus, Trash2, ArrowRight, ArrowLeft } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { useAuth } from "@/context/AuthContext";
import { EmergencyContactItem } from "@/types/user";

export default function OnboardingContactsStepPage() {
  const router = useRouter();
  const { user, updateUser } = useAuth();

  const [contacts, setContacts] = useState<EmergencyContactItem[]>(
    user?.emergencyContacts || [
      { id: "cnt-1", name: "Mother (Primary)", relation: "Parent", phone: "+91 98765 43210" },
    ]
  );

  const [newName, setNewName] = useState("");
  const [newRelation, setNewRelation] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const handleAddContact = () => {
    if (!newName || !newPhone) return;
    const item: EmergencyContactItem = {
      id: `cnt-${Date.now()}`,
      name: newName,
      relation: newRelation || "Family",
      phone: newPhone,
    };
    setContacts([...contacts, item]);
    setNewName("");
    setNewRelation("");
    setNewPhone("");
  };

  const handleRemoveContact = (id: string) => {
    setContacts(contacts.filter((c) => c.id !== id));
  };

  const handleNext = () => {
    updateUser({ emergencyContacts: contacts });
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
            <div className="space-y-3">
              {contacts.map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold text-sm shrink-0">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#0F172A]">{c.name}</p>
                      <p className="text-xs text-[#64748B]">{c.phone} · {c.relation}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveContact(c.id)}
                    className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                    aria-label="Remove contact"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Contact Form */}
            <div className="p-4 rounded-2xl border border-slate-200 space-y-3 bg-white">
              <h4 className="font-bold text-xs text-[#0F172A]">Add Another Contact</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Contact Name"
                  placeholder="e.g. Father"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <Input
                  label="Relationship"
                  placeholder="e.g. Parent"
                  value={newRelation}
                  onChange={(e) => setNewRelation(e.target.value)}
                />
              </div>
              <Input
                label="Phone Number"
                placeholder="+91 98123 45678"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                leftIcon={<Phone className="h-4 w-4" />}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full"
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
                className="flex-1"
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
      </PageContainer>
    </div>
  );
}
