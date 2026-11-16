"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSafeRouter } from "@/hooks/useSafeRouter";
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export const RegisterForm: React.FC = () => {
  const router = useSafeRouter();
  const { register, error: authError, clearError } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { label: "", color: "", width: "0%" };
    if (pass.length < 8) return { label: "Weak (Min 8 chars required)", color: "bg-red-500 text-red-500", width: "33%" };
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNum = /[0-9]/.test(pass);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pass);

    if (hasUpper && hasLower && hasNum && hasSpecial) {
      return { label: "Strong", color: "bg-emerald-500 text-emerald-500", width: "100%" };
    }
    return { label: "Fair (Add uppercase, number & symbol)", color: "bg-amber-500 text-amber-500", width: "66%" };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setLocalError(null);
    clearError();

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedFirstName || !trimmedLastName) {
      setLocalError("Please provide your first and last name.");
      return;
    }
    if (!trimmedEmail) {
      setLocalError("Please provide a valid email address.");
      return;
    }
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters long.");
      return;
    }
    const passwordComplexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordComplexityRegex.test(password)) {
      setLocalError("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
      return;
    }
    if (!agreeTerms || !agreePrivacy) {
      setLocalError("Please accept the Terms of Service and Privacy Policy to continue.");
      return;
    }

    setIsLoading(true);
    try {
      const success = await register({
        firstName: trimmedFirstName,
        lastName: trimmedLastName,
        email: trimmedEmail,
        phone: trimmedPhone,
        password,
      });
      if (success) {
        router.push("/onboarding");
      }
    } catch (err: any) {
      setLocalError(err.message || "Registration failed. Please try again.");
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="First Name *"
          placeholder="Yatendra"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          leftIcon={<User className="h-4 w-4" />}
          required
        />
        <Input
          label="Last Name *"
          placeholder="Singh"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>

      <Input
        label="Email Address *"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        leftIcon={<Mail className="h-4 w-4" />}
        required
      />

      <Input
        label="Phone Number"
        placeholder="+91 98765 43210"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        leftIcon={<Phone className="h-4 w-4" />}
      />

      <div className="space-y-1">
        <div className="relative">
          <Input
            label="Password *"
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

        {/* Strength Bar */}
        {password && (
          <div className="space-y-1 pt-1">
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${strength.color.split(" ")[0]}`}
                style={{ width: strength.width }}
              />
            </div>
            <div className="text-[10px] text-right font-bold text-slate-500">
              Strength: <span className={strength.color.split(" ")[1]}>{strength.label}</span>
            </div>
          </div>
        )}
      </div>

      <Input
        label="Confirm Password *"
        type={showPassword ? "text" : "password"}
        placeholder="••••••••"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        leftIcon={<Lock className="h-4 w-4" />}
        required
      />

      {/* Consent Checkboxes */}
      <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-[#64748B]">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
          />
          <span>I agree to the Terms of Service</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={agreePrivacy}
            onChange={(e) => setAgreePrivacy(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
          />
          <span>I acknowledge the Privacy Policy</span>
        </label>
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
        Create Account
      </Button>

      <div className="text-center text-xs text-[#64748B] pt-2">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-[#2563EB] hover:underline">
          Sign in
        </Link>
      </div>
    </form>
  );
};
