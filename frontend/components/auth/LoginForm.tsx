"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

interface LoginFormProps {
  onSuccessRedirect?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccessRedirect = "/profile" }) => {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setIsLoading(true);
    setTimeout(async () => {
      await login(email, password);
      setIsLoading(false);
      router.push(onSuccessRedirect);
    }, 600);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-semibold">
          {error}
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
        <div className="text-right">
          <a href="#" onClick={(e) => e.preventDefault()} className="text-xs text-[#2563EB] hover:underline font-semibold">
            Forgot password?
          </a>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="md"
        className="w-full bg-[#2563EB] hover:bg-blue-700 font-bold"
        isLoading={isLoading}
        rightIcon={<ArrowRight className="h-4 w-4" />}
      >
        Sign In
      </Button>

      {/* Demo Social Logins */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-[#64748B] font-semibold">Or continue with demo</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
          className="p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#0F172A] hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
        >
          <span>Google (Demo)</span>
        </button>
        <button
          type="button"
          onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
          className="p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#0F172A] hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
        >
          <span>Apple (Demo)</span>
        </button>
      </div>

      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-[#64748B] flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-[#2563EB] shrink-0" />
        <span>Frontend demo authentication state. No real server connected.</span>
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
