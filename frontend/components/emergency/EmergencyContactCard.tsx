"use client";

import React, { useState } from "react";
import { User as UserIcon, Phone, MessageSquare, Plus, Edit2, Trash2, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { EmergencyContactItem } from "@/types/user";
import { EmergencyContactModal } from "./EmergencyContactModal";

export const EmergencyContactCard: React.FC = () => {
  const { user, addEmergencyContact, updateEmergencyContact, deleteEmergencyContact } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContactItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const contacts = user?.emergencyContacts || [];

  const handleOpenAddModal = () => {
    setEditingContact(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (contact: EmergencyContactItem) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const handleSaveContact = async (data: { name: string; relation: string; phone: string }) => {
    if (editingContact) {
      await updateEmergencyContact(editingContact.id || editingContact._id!, data);
    } else {
      await addEmergencyContact(data);
    }
  };

  const handleConfirmDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      await deleteEmergencyContact(id);
    } finally {
      setIsDeleting(false);
      setDeleteConfirmId(null);
    }
  };

  return (
    <>
      <Card radius="xl" className="p-6 bg-white border border-[#E2E8F0] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-[#0F172A] flex items-center gap-2">
            <Phone className="h-5 w-5 text-[#2563EB]" /> Emergency Contacts
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleOpenAddModal}
            leftIcon={<Plus className="h-3.5 w-3.5" />}
            className="text-[#2563EB] hover:bg-blue-50 font-bold"
          >
            Add Contact
          </Button>
        </div>

        {contacts.length === 0 ? (
          <div className="p-6 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 space-y-3">
            <div className="h-12 w-12 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-sm text-[#0F172A]">No emergency contacts added yet.</p>
              <p className="text-xs text-[#64748B]">Add a trusted family member or friend for emergency dispatch notifications.</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenAddModal}
              leftIcon={<Plus className="h-3.5 w-3.5" />}
              className="font-bold text-xs"
            >
              + Add Emergency Contact
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {contacts.map((c) => {
              const contactId = c.id || c._id!;
              const isDeletingThis = deleteConfirmId === contactId;

              return (
                <div
                  key={contactId}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold text-sm shrink-0">
                      <UserIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#0F172A]">{c.name}</p>
                      <p className="text-xs text-[#64748B]">{c.phone} · {c.relation || c.relationship}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {/* Call button */}
                    <a
                      href={`tel:${c.phone}`}
                      className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors flex items-center justify-center"
                      title={`Call ${c.name}`}
                      aria-label={`Call ${c.name}`}
                    >
                      <Phone className="h-4 w-4" />
                    </a>

                    {/* SMS button */}
                    <a
                      href={`sms:${c.phone}`}
                      className="p-2 rounded-xl bg-blue-50 text-[#2563EB] hover:bg-blue-100 transition-colors flex items-center justify-center"
                      title={`Send SMS to ${c.name}`}
                      aria-label={`Send SMS to ${c.name}`}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </a>

                    {/* Edit button */}
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(c)}
                      className="p-2 rounded-xl bg-slate-200/60 text-slate-600 hover:bg-slate-200 transition-colors"
                      title={`Edit ${c.name}`}
                      aria-label={`Edit ${c.name}`}
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(contactId)}
                      className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                      title={`Delete ${c.name}`}
                      aria-label={`Delete ${c.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Inline Delete Confirmation */}
                  {isDeletingThis && (
                    <div className="w-full pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                      <span className="text-red-700 font-semibold">Delete contact {c.name}?</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-2.5 py-1 rounded-lg bg-slate-200 text-slate-700 font-medium"
                          disabled={isDeleting}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleConfirmDelete(contactId)}
                          className="px-2.5 py-1 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700"
                          disabled={isDeleting}
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <EmergencyContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialContact={editingContact}
        onSave={handleSaveContact}
      />
    </>
  );
};

