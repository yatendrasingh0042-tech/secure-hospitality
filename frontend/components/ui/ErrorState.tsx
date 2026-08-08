"use client";

import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Failed to load data",
  description = "Something went wrong while retrieving information. Please try refreshing.",
  onRetry,
  className = "",
}) => {
  return (
    <Card radius="xl" className={`p-8 text-center max-w-md mx-auto space-y-4 border border-red-100 bg-red-50/40 ${className}`}>
      <div className="h-14 w-14 rounded-2xl bg-red-100 text-[#EF4444] flex items-center justify-center mx-auto shadow-xs">
        <AlertCircle className="h-7 w-7" />
      </div>

      <div className="space-y-1">
        <h3 className="font-bold text-base text-[#0F172A]">{title}</h3>
        <p className="text-xs text-[#64748B] leading-relaxed">{description}</p>
      </div>

      {onRetry && (
        <div className="pt-1">
          <Button
            variant="outline"
            size="sm"
            className="border-red-200 text-[#EF4444] hover:bg-red-100/50"
            leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
            onClick={onRetry}
          >
            Try Again
          </Button>
        </div>
      )}
    </Card>
  );
};
