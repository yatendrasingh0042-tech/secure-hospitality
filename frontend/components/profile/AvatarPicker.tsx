"use client";

import React, { useRef, useState, useEffect } from "react";
import { Camera, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AvatarPickerProps {
  avatarUrl?: string;
  onChange: (newAvatarUrl: string) => void;
  onError?: (errorMessage: string) => void;
  firstName?: string;
  lastName?: string;
}

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const AvatarPicker: React.FC<AvatarPickerProps> = ({
  avatarUrl,
  onChange,
  onError,
  firstName = "User",
  lastName = "",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  // Clean up Object URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (objectUrl && objectUrl.startsWith("blob:")) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Type validation
    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      if (onError) {
        onError("Please select a JPG, PNG, or WEBP image.");
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Size validation
    if (file.size > MAX_FILE_SIZE) {
      if (onError) {
        onError("Image must be smaller than 5 MB.");
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Create local object URL for instant preview
    const newObjectUrl = URL.createObjectURL(file);
    if (objectUrl && objectUrl.startsWith("blob:")) {
      URL.revokeObjectURL(objectUrl);
    }
    setObjectUrl(newObjectUrl);

    // Convert file to Base64 Data URL for persistent state & backend storage
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleTriggerPicker = () => {
    fileInputRef.current?.click();
  };

  const currentAvatar = objectUrl || avatarUrl;
  const initials = `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase() || "U";

  return (
    <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />

      <div className="relative group cursor-pointer" onClick={handleTriggerPicker}>
        {currentAvatar ? (
          <img
            src={currentAvatar}
            alt="Profile avatar preview"
            className="h-20 w-20 rounded-full object-cover border-2 border-white shadow-md ring-2 ring-blue-500/20 group-hover:opacity-90 transition-opacity"
          />
        ) : (
          <div className="h-20 w-20 rounded-full bg-[#2563EB] text-white font-extrabold text-2xl flex items-center justify-center border-2 border-white shadow-md group-hover:bg-blue-700 transition-colors">
            {initials}
          </div>
        )}

        <div
          aria-label="Upload photo"
          className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-slate-900 text-white flex items-center justify-center border-2 border-white shadow-sm group-hover:scale-110 transition-transform"
        >
          <Camera className="h-3.5 w-3.5" />
        </div>
      </div>

      <div className="flex-1 text-center sm:text-left space-y-1.5">
        <h4 className="font-bold text-sm text-[#0F172A]">Profile Avatar</h4>
        <p className="text-xs text-[#64748B]">Choose a photo from your device (JPG, PNG, WEBP up to 5 MB)</p>
        <div className="pt-0.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleTriggerPicker}
            leftIcon={<ImageIcon className="h-3.5 w-3.5 text-[#2563EB]" />}
            className="font-semibold text-xs"
          >
            Change Avatar
          </Button>
        </div>
      </div>
    </div>
  );
};
