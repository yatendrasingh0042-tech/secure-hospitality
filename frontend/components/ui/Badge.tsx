"use client";

import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "warning" | "danger" | "info" | "neutral";
  size?: "sm" | "md";
  showDot?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = "info",
      size = "md",
      showDot = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center font-medium rounded-full transition-colors select-none";

    const variants = {
      success:
        "bg-emerald-50 text-[#10B981] border border-emerald-200/80",
      warning:
        "bg-amber-50 text-[#F59E0B] border border-amber-200/80",
      danger:
        "bg-red-50 text-[#EF4444] border border-red-200/80",
      info:
        "bg-blue-50 text-[#2563EB] border border-blue-200/80",
      neutral:
        "bg-slate-100 text-[#64748B] border border-slate-200/80",
    };

    const dotColors = {
      success: "bg-[#10B981]",
      warning: "bg-[#F59E0B]",
      danger: "bg-[#EF4444]",
      info: "bg-[#2563EB]",
      neutral: "bg-[#64748B]",
    };

    const sizes = {
      sm: "px-2.5 py-0.5 text-xs gap-1.5",
      md: "px-3 py-1 text-xs sm:text-sm gap-2",
    };

    return (
      <span
        ref={ref}
        className={twMerge(
          clsx(baseStyles, variants[variant], sizes[size], className)
        )}
        {...props}
      >
        {showDot && (
          <span
            className={clsx(
              "h-1.5 w-1.5 rounded-full shrink-0 animate-pulse",
              dotColors[variant]
            )}
            aria-hidden="true"
          />
        )}
        <span>{children}</span>
      </span>
    );
  }
);

Badge.displayName = "Badge";
