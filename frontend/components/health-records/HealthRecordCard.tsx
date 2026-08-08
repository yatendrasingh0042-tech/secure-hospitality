"use client";

import React from "react";
import Link from "next/link";
import { FileText, Calendar, Building2, Eye } from "lucide-react";
import { HealthRecord } from "@/data/healthRecords";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface HealthRecordCardProps {
  record: HealthRecord;
}

export const HealthRecordCard: React.FC<HealthRecordCardProps> = ({ record }) => {
  return (
    <Card radius="xl" className="p-5 bg-white border border-[#E2E8F0] space-y-4 hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`h-11 w-11 rounded-2xl ${record.accentColor} text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs`}>
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <Badge variant="info" size="sm">
              {record.category}
            </Badge>
            <h4 className="font-bold text-base text-[#0F172A] mt-1 line-clamp-1">
              {record.title}
            </h4>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-mono font-bold text-[10px] text-slate-600">
          {record.fileType}
        </span>
      </div>

      <div className="space-y-1 text-xs text-[#64748B] p-3 rounded-xl bg-slate-50 border border-slate-100">
        <p className="flex items-center gap-1.5 font-medium">
          <Building2 className="h-3.5 w-3.5 text-slate-400" /> {record.facilityName} · {record.doctorName}
        </p>
        <p className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-slate-400" /> {record.date} ({record.fileSize})
        </p>
      </div>

      <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
        {record.summary}
      </p>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <span className="text-[10px] text-slate-400 font-mono">ID: {record.id}</span>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/health-records/${record.id}`}>
            <Eye className="h-3.5 w-3.5 mr-1" /> View Record
          </Link>
        </Button>
      </div>
    </Card>
  );
};
