"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Phone, HeartHandshake, Check, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { EmergencyContactItem } from "@/types/user";

interface EmergencyContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialContact?: EmergencyContactItem | null;
  onSave: (data: { name: string; relation: string; phone: string }) => Promise<void>;
}

export const EmergencyContactModal: React.FC<EmergencyContactModalProps> = ({
  isOpen,
  onClose,
  initialContact,
  onSave,
}) => {
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialContact) {
        setName(initialContact.name || "");
        setRelation(initialContact.relation || initialContact.relationship || "");
        setPhone(initialContact.phone || "");
      } else {
        setName("");
        setRelation("");
        setPhone("");
      }
      setErrorMsg(null);
      setIsSaving(false);
    }
  }, [isOpen, initialContact]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedName = name.trim();
    const trimmedRelation = relation.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) {
      setErrorMsg("Contact Name is required.");
      return;
    }
    if (!trimmedRelation) {
      setErrorMsg("Relationship is required.");
      return;
    }
    if (!trimmedPhone) {
      setErrorMsg("Phone Number is required.");
      return;
    }

    const phoneRegex = /^[0-9+\-\s()]{7,20}$/;
    if (!phoneRegex.test(trimmedPhone)) {
      setErrorMsg("Please provide a valid phone number (e.g. +91 98765 43210).");
      return;
    }

    try {
      setIsSaving(true);
      await onSave({
        name: trimmedName,
        relation: trimmedRelation,
        phone: trimmedPhone,
      });
      setIsSaving(false);
      onClose();
    } catch (err: any) {
      setIsSaving(false);
      setErrorMsg(err.message || "Failed to save emergency contact. Please try again.");
    }
  };

  const isEditing = Boolean(initialContact);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 space-y-6 p-6"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="space-y-0.5">
                <h3 id="contact-modal-title" className="font-extrabold text-lg text-[#0F172A]">
                  {isEditing ? "Edit Emergency Contact" : "Add Emergency Contact"}
                </h3>
                <p className="text-xs text-[#64748B]">
                  {isEditing ? "Update details for this contact." : "Add someone to notify during emergencies."}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Contact Name *"
                placeholder="e.g. Father (Primary)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={<User className="h-4 w-4 text-[#2563EB]" />}
                required
              />

              <Input
                label="Relationship *"
                placeholder="e.g. Parent, Spouse, Sibling, Friend"
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

              <div className="pt-3 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={onClose}
                  disabled={isSaving}
                  className="flex-1"
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
                  {isEditing ? "Update Contact" : "Save Contact"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
