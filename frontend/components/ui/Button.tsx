"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Slot } from "@radix-ui/react-slot";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      asChild = false,
      children,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.98]";

    const variants = {
      primary:
        "bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-sm hover:shadow-md hover:-translate-y-0.5",
      secondary:
        "bg-slate-100 text-[#0F172A] hover:bg-slate-200 hover:text-[#0F172A]",
      outline:
        "border border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-slate-50 hover:border-slate-300 shadow-2xs",
      ghost:
        "text-[#64748B] hover:bg-slate-100 hover:text-[#0F172A]",
      danger:
        "bg-[#EF4444] text-white hover:bg-red-600 shadow-sm hover:shadow-md hover:-translate-y-0.5",
    };

    const sizes = {
      sm: "h-9 px-3.5 text-xs rounded-lg gap-1.5",
      md: "h-11 px-5 text-sm rounded-xl gap-2",
      lg: "h-13 px-6 text-base rounded-xl gap-2.5",
    };

    const buttonClasses = twMerge(clsx(baseStyles, variants[variant], sizes[size], className));

    if (asChild) {
      let finalChildren = children;

      if ((leftIcon || rightIcon || isLoading) && React.isValidElement(children)) {
        const childElement = children as React.ReactElement<{ children?: React.ReactNode }>;
        const childChildren = childElement.props.children;

        finalChildren = React.cloneElement(
          childElement,
          {},
          isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-current" />
          ) : leftIcon ? (
            <span className="inline-flex shrink-0">{leftIcon}</span>
          ) : null,
          <span>{childChildren}</span>,
          !isLoading && rightIcon ? (
            <span className="inline-flex shrink-0">{rightIcon}</span>
          ) : null
        );
      }

      return (
        <Slot
          ref={ref}
          className={buttonClasses}
          {...props}
        >
          {finalChildren}
        </Slot>
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={buttonClasses}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-current" />
        ) : leftIcon ? (
          <span className="inline-flex shrink-0">{leftIcon}</span>
        ) : null}
        <span>{children}</span>
        {!isLoading && rightIcon ? (
          <span className="inline-flex shrink-0">{rightIcon}</span>
        ) : null}
      </button>
    );
  }
);

Button.displayName = "Button";
