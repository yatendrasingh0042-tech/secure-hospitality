"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSafeRouter } from "@/hooks/useSafeRouter";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

interface LoginFormProps {
  onSuccessRedirect?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccessRedirect = "/profile" }) => {
  const router = useSafeRouter();
  const { login, error: authError, clearError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setLocalError(null);
    clearError();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setLocalError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setLocalError("Please enter your password.");
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(trimmedEmail, password);
      if (success) {
        const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (storedToken) {
          try {
            const payload = JSON.parse(atob(storedToken.split(".")[1]));
            if (["admin", "super_admin", "hospital_admin"].includes(payload.role)) {
              router.push("/admin");
              return;
            }
          } catch (_) {}
        }
        router.push(onSuccessRedirect);
      }
    } catch (err: any) {
      setLocalError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const displayError = localError || authError;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {displayError && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-semibold">
          {displayError}
        </div>
      )}

      <Input
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        leftIcon={<Mail className="h-4 w-4" />}
        required
      />

      <div className="space-y-1">
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="h-4 w-4" />}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-slate-400 hover:text-slate-600 focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="md"
        className="w-full bg-[#2563EB] hover:bg-blue-700 font-bold"
        isLoading={isLoading}
        disabled={isLoading}
        rightIcon={<ArrowRight className="h-4 w-4" />}
      >
        Sign In
      </Button>

      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-[#64748B] flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-[#2563EB] shrink-0" />
        <span>Secure sign-in with 256-bit encrypted authentication</span>
      </div>

      <div className="text-center text-xs text-[#64748B] pt-2">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-bold text-[#2563EB] hover:underline">
          Register
        </Link>
      </div>
    </form>
  );
};
