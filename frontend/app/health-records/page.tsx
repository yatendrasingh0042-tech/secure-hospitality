"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { FileText, Search, ArrowLeft } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { HealthRecordCard } from "@/components/health-records/HealthRecordCard";
import { DocumentUploader } from "@/components/health-records/DocumentUploader";
import { HEALTH_RECORDS_DATA, HealthRecord } from "@/data/healthRecords";

function HealthRecordsContent() {
  const [records, setRecords] = useState<HealthRecord[]>(HEALTH_RECORDS_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Prescriptions",
    "Lab Reports",
    "Medical Documents",
    "Vaccination Records",
    "Visit Summaries",
  ];

  const handleUploadSuccess = (title: string, category: string) => {
    const newRec: HealthRecord = {
      id: `rec-${Date.now()}`,
      title,
      category: category as HealthRecord["category"],
      doctorName: "Dr. Self / Uploaded",
      facilityName: "Patient Record Library",
      date: "Today",
      fileType: "PDF",
      fileSize: "1.1 MB",
      summary: "User uploaded document added during active session.",
      downloadUrl: "#",
      accentColor: "bg-blue-500",
    };
    setRecords([newRec, ...records]);
  };

  const filtered = records.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.facilityName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = selectedCategory === "All" || r.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="py-8 lg:py-14 bg-[#F8FAFC] min-h-screen">
      <PageContainer>
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#0F172A]"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>
          </div>

          {/* Header */}
          <div className="space-y-1">
            <Badge variant="info" size="sm" showDot>
              Medical Repository
            </Badge>
            <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Health Records & Documents
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Keep your prescriptions, diagnostic lab reports, and vaccination certificates organized.
            </p>
          </div>

          {/* Document Uploader Card */}
          <DocumentUploader onUploadSuccess={handleUploadSuccess} />

          {/* Filter & Search Toolbar */}
          <div className="space-y-4">
            <Input
              placeholder="Search by report title, doctor name, or hospital..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />

            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? "bg-[#2563EB] text-white shadow-xs"
                      : "bg-white border border-slate-200 text-[#64748B] hover:bg-slate-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Records Grid */}
          {filtered.length === 0 ? (
            <Card radius="xl" className="p-8 text-center bg-white border border-[#E2E8F0] space-y-3">
              <FileText className="h-10 w-10 text-slate-300 mx-auto" />
              <h4 className="font-bold text-[#0F172A]">No health records found</h4>
              <p className="text-xs text-[#64748B]">Try adjusting your search query or category filter.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((rec) => (
                <HealthRecordCard key={rec.id} record={rec} />
              ))}
            </div>
          )}
        </div>
      </PageContainer>
    </div>
  );
}

export default function HealthRecordsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-slate-500">Loading Health Records...</div>}>
      <HealthRecordsContent />
    </Suspense>
  );
}
