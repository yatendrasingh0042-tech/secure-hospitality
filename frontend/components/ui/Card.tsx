"use client";

import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "interactive" | "elevated" | "glass";
  padding?: "none" | "sm" | "md" | "lg";
  radius?: "sm" | "md" | "lg" | "xl";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = "default",
      padding = "md",
      radius = "lg",
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = "transition-all duration-200 overflow-hidden";

    const variants = {
      default:
        "bg-white border border-[#E2E8F0] shadow-xs",
      interactive:
        "bg-white border border-[#E2E8F0] shadow-xs hover:shadow-lg hover:border-slate-300 hover:-translate-y-1 cursor-pointer",
      elevated:
        "bg-white border border-slate-100 shadow-md hover:shadow-xl",
      glass:
        "glass-card shadow-xs hover:shadow-md",
    };

    const paddings = {
      none: "p-0",
      sm: "p-4 sm:p-5",
      md: "p-6 sm:p-7",
      lg: "p-8 sm:p-10",
    };

    const radii = {
      sm: "rounded-lg",
      md: "rounded-xl",
      lg: "rounded-2xl",
      xl: "rounded-3xl",
    };

    return (
      <div
        ref={ref}
        className={twMerge(
          clsx(baseStyles, variants[variant], paddings[padding], radii[radius], className)
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export const CardHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={twMerge(clsx("flex flex-col space-y-1.5 mb-4", className))} {...props} />
);
CardHeader.displayName = "CardHeader";

export const CardTitle = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={twMerge(
      clsx("text-lg font-semibold tracking-tight text-[#0F172A]", className)
    )}
    {...props}
  >
    {children}
  </h3>
);
CardTitle.displayName = "CardTitle";

export const CardDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p
    className={twMerge(clsx("text-sm text-[#64748B] leading-relaxed", className))}
    {...props}
  />
);
CardDescription.displayName = "CardDescription";

export const CardContent = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={twMerge(clsx("pt-0", className))} {...props} />
);
CardContent.displayName = "CardContent";

export const CardFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={twMerge(
      clsx("flex items-center pt-4 border-t border-slate-100 mt-4", className)
    )}
    {...props}
  />
);
CardFooter.displayName = "CardFooter";
