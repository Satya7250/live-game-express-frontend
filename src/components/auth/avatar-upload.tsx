"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { uploadImageToCloudinary } from "@/lib/cloudinary";

interface AvatarUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onUploading?: (uploading: boolean) => void;
}

export default function AvatarUpload({
  value,
  onChange,
  onUploading,
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    value || null
  );

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  useEffect(() => {
    onUploading?.(isUploading);
  }, [isUploading, onUploading]);

  useEffect(() => {
    setPreview(value || null);
  }, [value]);

  const handleClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();

    setPreview(null);
    onChange("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file || isUploading) return;

    try {
      setIsUploading(true);

      const previewUrl = await new Promise<string>(
        (resolve, reject) => {
          const reader = new FileReader();

          reader.onload = () => {
            if (
              typeof reader.result === "string"
            ) {
              resolve(reader.result);
            } else {
              reject(
                new Error(
                  "Failed to generate image preview"
                )
              );
            }
          };

          reader.onerror = () =>
            reject(
              new Error(
                "Failed to read selected file"
              )
            );

          reader.readAsDataURL(file);
        }
      );

      setPreview(previewUrl);

      const secureUrl =
        await uploadImageToCloudinary(file);

      onChange(secureUrl);

      toast.success(
        "Profile image uploaded successfully"
      );
    } catch (error) {
      setPreview(value || null);

      toast.error(
        error instanceof Error
          ? error.message
          : "Image upload failed"
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(event) => {
          if (
            event.key === "Enter" ||
            event.key === " "
          ) {
            handleClick();
          }
        }}
        className={`relative group transition-all duration-300 ${
          isUploading
            ? "cursor-not-allowed"
            : "cursor-pointer"
        }`}
      >
        <div
          className={`relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2 border-dashed transition-all ${
            preview
              ? "border-transparent"
              : "border-white/10 hover:border-cyan-500/50 bg-white/[0.02] hover:bg-cyan-500/[0.02]"
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
              <span className="mt-2 text-xs text-neutral-400">
                Uploading...
              </span>
            </div>
          ) : preview ? (
            <Image
              src={preview}
              alt="Profile avatar"
              fill
              className="object-cover"
            />
          ) : (
            <Upload className="h-8 w-8 text-neutral-500 transition-colors group-hover:text-cyan-400" />
          )}
        </div>

        {preview && !isUploading && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -right-1 -top-1 rounded-full bg-red-600/90 border border-red-500/30 p-1 text-white shadow-lg shadow-black/50 hover:bg-red-500 transition-all duration-200 cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}

        {!preview && !isUploading && (
          <div className="absolute inset-0 rounded-full bg-black/0 transition-all group-hover:bg-cyan-500/5" />
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        disabled={isUploading}
        className="hidden"
      />

      {!isUploading && (
        <span className="text-xs text-neutral-400 transition-colors duration-200 group-hover:text-neutral-300">
          {preview
            ? "Click to change image"
            : "Click to upload profile image"}
        </span>
      )}
    </div>
  );
}