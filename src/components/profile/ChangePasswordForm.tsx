"use client";

import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from "@/schemas/change-password.schema";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ChangePasswordForm() {
  const {
    changePassword,
    loading,
    error,
  } = useAuth();

  const [success, setSuccess] =
    useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(
      changePasswordSchema
    ),
  });

  const onSubmit = async (
    data: ChangePasswordFormData
  ) => {
    try {
      setSuccess("");

      const response =
        await changePassword(
          data.oldPassword,
          data.newPassword
        );

      setSuccess(response.message);

      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="oldPassword">Current Password</Label>
        <Input
          id="oldPassword"
          type="password"
          placeholder="Enter your current password"
          {...register(
            "oldPassword"
          )}
        />
        {errors.oldPassword && (
          <p className="text-sm text-destructive">
            {errors.oldPassword.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password</Label>
        <Input
          id="newPassword"
          type="password"
          placeholder="Enter your new password"
          {...register(
            "newPassword"
          )}
        />
        {errors.newPassword && (
          <p className="text-sm text-destructive">
            {errors.newPassword.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm your new password"
          {...register(
            "confirmPassword"
          )}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">
            {
              errors.confirmPassword
                .message
            }
          </p>
        )}
      </div>

      {error && (
        <p className="text-destructive">
          {error}
        </p>
      )}

      {success && (
        <p className="text-green-600">
          {success}
        </p>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading
          ? "Updating..."
          : "Change Password"}
      </Button>
    </form>
  );
}