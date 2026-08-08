"use client";

import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Badge } from "./Badge";

export interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  heading: string;
  description?: string;
  action?: React.ReactNode;
  align?: "left" | "center";
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  className,
  eyebrow,
  heading,
  description,
  action,
  align = "left",
  ...props
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          "flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14",
          align === "center" && "text-center md:flex-col md:items-center",
          className
        )
      )}
      {...props}
    >
      <div className={clsx("space-y-3 max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && (
          <div>
            <Badge variant="info" size="sm">
              {eyebrow}
            </Badge>
          </div>
        )}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0F172A]">
          {heading}
        </h2>
        {description && (
          <p className="text-base sm:text-lg text-[#64748B] leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
