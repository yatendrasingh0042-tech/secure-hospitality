"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Calendar,
  Building2,
  Download,
  Printer,
  ShieldCheck,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { HEALTH_RECORDS_DATA } from "@/data/healthRecords";

function RecordDetailContent() {
  const params = useParams();
  const id = params.id as string;

  const record = HEALTH_RECORDS_DATA.find((r) => r.id === id) || HEALTH_RECORDS_DATA[0];

  return (
    <div className="py-8 lg:py-14 bg-[#F8FAFC] min-h-screen">
      <PageContainer>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Back Navigation */}
          <Link
            href="/health-records"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#0F172A]"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Health Records
          </Link>

          {/* Record Summary Header Card */}
          <Card radius="xl" className="p-6 sm:p-8 bg-white border border-[#E2E8F0] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="info" size="sm">
                    {record.category}
                  </Badge>
                  <span className="text-xs font-mono font-bold text-slate-400">ID: {record.id}</span>
                </div>
                <h1 className="text-2xl font-extrabold text-[#0F172A]">{record.title}</h1>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Printer className="h-3.5 w-3.5" />}
                  onClick={() => window.print()}
                >
                  Print
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Download className="h-3.5 w-3.5" />}
                  onClick={() => alert("Simulated file download for " + record.title)}
                  className="bg-[#2563EB]"
                >
                  Download ({record.fileType})
                </Button>
              </div>
            </div>

            {/* Metadata Info Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-[#64748B] block font-medium">Attending Physician</span>
                <span className="font-bold text-[#0F172A] flex items-center gap-1 mt-0.5">
                  <Building2 className="h-3.5 w-3.5 text-slate-400" /> {record.doctorName}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] block font-medium">Healthcare Facility</span>
                <span className="font-bold text-[#0F172A]">{record.facilityName}</span>
              </div>
              <div>
                <span className="text-[#64748B] block font-medium">Record Date & Size</span>
                <span className="font-bold text-[#0F172A] flex items-center gap-1 mt-0.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" /> {record.date} ({record.fileSize})
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#0F172A]">Record Summary</h4>
              <p className="text-xs text-[#64748B] leading-relaxed p-4 rounded-2xl bg-blue-50/40 border border-blue-100">
                {record.summary}
              </p>
            </div>
          </Card>

          {/* Document Canvas Preview Panel */}
          <Card radius="xl" className="p-6 bg-white border border-[#E2E8F0] space-y-4">
            <h3 className="font-bold text-base text-[#0F172A] flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#2563EB]" /> Document Preview Canvas (Simulated)
            </h3>

            <div className="relative h-96 w-full rounded-2xl bg-slate-900 border border-slate-700 overflow-hidden flex flex-col items-center justify-center p-6 text-center space-y-4 shadow-inner">
              <div className="h-16 w-16 rounded-2xl bg-white/10 text-white flex items-center justify-center font-bold text-xl">
                <FileText className="h-8 w-8 text-blue-400" />
              </div>
              <div className="space-y-1 max-w-sm">
                <p className="text-sm font-bold text-white">{record.title}</p>
                <p className="text-xs text-slate-400">
                  Document Preview ({record.fileType} · {record.fileSize})
                </p>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-[11px] text-slate-300 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Simulated Medical Document Canvas — No actual remote files loaded</span>
              </div>
            </div>
          </Card>
        </div>
      </PageContainer>
    </div>
  );
}

export default function RecordDetailPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-slate-500">Loading Record Details...</div>}>
      <RecordDetailContent />
    </Suspense>
  );
}
