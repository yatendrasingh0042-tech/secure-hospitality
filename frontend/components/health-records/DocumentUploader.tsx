"use client";

import React, { useState } from "react";
import { UploadCloud, FileText, CheckCircle2, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface DocumentUploaderProps {
  onUploadSuccess?: (title: string, category: string) => void;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onUploadSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedSuccessMsg, setUploadedSuccessMsg] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSimulateUpload = () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setUploadedSuccessMsg(true);
      if (onUploadSuccess) {
        onUploadSuccess(selectedFile.name, "Medical Documents");
      }
      setTimeout(() => {
        setSelectedFile(null);
        setUploadedSuccessMsg(false);
      }, 2500);
    }, 1000);
  };

  return (
    <Card radius="xl" className="p-6 bg-white border border-[#E2E8F0] space-y-4">
      <div className="space-y-1">
        <h3 className="font-bold text-base text-[#0F172A] flex items-center gap-2">
          <UploadCloud className="h-5 w-5 text-[#2563EB]" /> Upload Health Document
        </h3>
        <p className="text-xs text-[#64748B]">Add lab reports, prescriptions, or vaccination records to your library.</p>
      </div>

      {/* Drag & Drop Canvas */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`p-8 rounded-2xl border-2 border-dashed text-center space-y-3 transition-all cursor-pointer ${
          dragActive
            ? "border-[#2563EB] bg-blue-50/60"
            : selectedFile
            ? "border-emerald-300 bg-emerald-50/40"
            : "border-slate-300 bg-slate-50 hover:bg-slate-100/80"
        }`}
      >
        <input
          type="file"
          id="doc-upload-input"
          accept=".pdf,.jpg,.png"
          onChange={handleChange}
          className="hidden"
        />

        <div className="h-12 w-12 rounded-2xl bg-blue-100 text-[#2563EB] flex items-center justify-center mx-auto">
          <UploadCloud className="h-6 w-6" />
        </div>

        {!selectedFile ? (
          <label htmlFor="doc-upload-input" className="block cursor-pointer space-y-1">
            <span className="text-sm font-bold text-[#0F172A] block">
              Drag & drop or choose a file
            </span>
            <span className="text-xs text-[#64748B] block">Supports PDF, JPG, PNG up to 10MB</span>
          </label>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#0F172A]">
              <FileText className="h-4 w-4 text-[#2563EB]" />
              <span>{selectedFile.name}</span>
            </div>
            <Button
              variant="primary"
              size="sm"
              isLoading={isUploading}
              onClick={handleSimulateUpload}
              className="bg-[#2563EB]"
            >
              Simulate Document Add
            </Button>
          </div>
        )}
      </div>

      {uploadedSuccessMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Document added to frontend health records list!</span>
        </div>
      )}

      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-[#64748B] flex items-center gap-2">
        <ShieldAlert className="h-4 w-4 text-[#2563EB] shrink-0" />
        <span>Demo mode: Health documents are not uploaded or stored by this frontend prototype.</span>
      </div>
    </Card>
  );
};
