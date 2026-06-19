"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api-error";
import {
  profileSchema,
  type ProfileFormData,
} from "@/schemas/profile.schema";
import AvatarUpload from "@/components/auth/avatar-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface ProfileFormProps {
  defaultValues: ProfileFormData;
  onSubmit: (data: ProfileFormData) => Promise<{ message: string }>;
  onSuccess?: () => void;
}

export default function ProfileForm({
  defaultValues,
  onSubmit,
  onSuccess,
}: ProfileFormProps) {
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  const isSubmitting = saving || imageUploading;

  const handleFormSubmit = async (data: ProfileFormData) => {
    if (imageUploading) {
      toast.error("Please wait for the image upload to finish.");
      return;
    }

    try {
      setSaving(true);

      const response = await onSubmit(data);

      toast.success(response.message || "Profile updated successfully");
      onSuccess?.();
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Failed to update profile"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4"
      noValidate
    >
      <div className="flex justify-center">
        <Controller
          name="avatar"
          control={control}
          render={({ field }) => (
            <AvatarUpload
              value={field.value}
              onChange={field.onChange}
              onUploading={setImageUploading}
            />
          )}
        />
      </div>

      {errors.avatar && (
        <p className="text-center text-sm text-destructive">
          {errors.avatar.message}
        </p>
      )}

      <Separator />

      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="profile-name">Name</Label>
          <Input
            id="profile-name"
            placeholder="Enter your name"
            disabled={isSubmitting}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="profile-phone">Phone</Label>
          <Input
            id="profile-phone"
            type="tel"
            placeholder="Enter your phone number"
            disabled={isSubmitting}
            {...register("phone")}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="profile-address">Address</Label>
          <Input
            id="profile-address"
            placeholder="Enter your address"
            disabled={isSubmitting}
            {...register("address")}
          />
          {errors.address && (
            <p className="text-sm text-destructive">{errors.address.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="profile-bio">Bio</Label>
          <Textarea
            id="profile-bio"
            placeholder="Tell us about yourself"
            rows={3}
            disabled={isSubmitting}
            {...register("bio")}
          />
          {errors.bio && (
            <p className="text-sm text-destructive">{errors.bio.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="btn-gaming bg-primary hover:bg-primary/95 text-white font-semibold shadow-md shadow-red-900/10 w-full mt-2">
        {imageUploading
          ? "Uploading image..."
          : saving
            ? "Saving profile..."
            : "Save Changes"}
      </Button>
    </form>
  );
}
