"use client";

import React, { useState } from "react";
import { User, Phone, MessageSquare, Plus, Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface ContactItem {
  name: string;
  phone: string;
  relation: string;
}

const DEFAULT_CONTACTS: ContactItem[] = [
  { name: "Mother (Primary)", phone: "+91 98765 43210", relation: "Parent" },
  { name: "Father", phone: "+91 98123 45678", relation: "Parent" },
];

export const EmergencyContactCard: React.FC = () => {
  const [contacts] = useState<ContactItem[]>(DEFAULT_CONTACTS);
  const [demoActionMsg, setDemoActionMsg] = useState<string | null>(null);

  const handleDemoTrigger = (action: string, contactName: string) => {
    setDemoActionMsg(`Demo ${action} initiated for ${contactName}. No real call/SMS sent.`);
    setTimeout(() => setDemoActionMsg(null), 3000);
  };

  return (
    <Card radius="xl" className="p-6 bg-white border border-[#E2E8F0] space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-base text-[#0F172A] flex items-center gap-2">
          <Phone className="h-5 w-5 text-[#2563EB]" /> Emergency Contacts
        </h3>
        <Button variant="ghost" size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>
          Add Contact
        </Button>
      </div>

      <div className="space-y-3">
        {contacts.map((c) => (
          <div
            key={c.name}
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

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleDemoTrigger("Call", c.name)}
                className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                aria-label={`Demo Call ${c.name}`}
              >
                <Phone className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDemoTrigger("SMS Message", c.name)}
                className="p-2 rounded-xl bg-blue-50 text-[#2563EB] hover:bg-blue-100 transition-colors"
                aria-label={`Demo SMS ${c.name}`}
              >
                <MessageSquare className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {demoActionMsg && (
        <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-[#2563EB] font-semibold flex items-center gap-2">
          <Check className="h-4 w-4 shrink-0" />
          <span>{demoActionMsg}</span>
        </div>
      )}
    </Card>
  );
};
