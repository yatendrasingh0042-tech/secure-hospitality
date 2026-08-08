"use client";

import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[#0F172A]"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 pointer-events-none text-[#64748B] flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            className={twMerge(
              clsx(
                "w-full h-11 bg-white text-[#0F172A] text-sm placeholder:text-[#64748B]/70 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:bg-slate-50 disabled:cursor-not-allowed",
                error
                  ? "border-[#EF4444] focus:ring-[#EF4444]"
                  : "border-[#E2E8F0] hover:border-slate-300 focus:border-[#2563EB] focus:ring-[#2563EB]",
                leftIcon ? "pl-10" : "pl-4",
                rightIcon ? "pr-10" : "pr-4",
                className
              )
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 pointer-events-none text-[#64748B] flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p id={errorId} className="text-xs font-medium text-[#EF4444]">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-xs text-[#64748B]">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
