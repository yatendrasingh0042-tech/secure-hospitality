"use client";

import React from "react";
import { FolderOpen } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = FolderOpen,
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}) => {
  return (
    <Card radius="xl" className={`p-8 lg:p-12 text-center max-w-md mx-auto space-y-4 border-dashed border-2 border-slate-200 bg-white/50 ${className}`}>
      <div className="h-16 w-16 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto shadow-xs">
        <Icon className="h-8 w-8" />
      </div>

      <div className="space-y-1">
        <h3 className="font-bold text-lg text-[#0F172A]">{title}</h3>
        <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">{description}</p>
      </div>

      {actionLabel && onAction && (
        <div className="pt-2">
          <Button variant="primary" size="sm" className="bg-[#2563EB]" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </Card>
  );
};
