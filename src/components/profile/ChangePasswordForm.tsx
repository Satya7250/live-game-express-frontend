"use client";

import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from "@/schemas/change-password.schema";

import { useAuth } from "@/hooks/useAuth";

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
      <div>
        <input
          type="password"
          placeholder="Current Password"
          {...register(
            "oldPassword"
          )}
          className="w-full border rounded p-3"
        />

        {errors.oldPassword && (
          <p className="text-red-500 text-sm mt-1">
            {errors.oldPassword.message}
          </p>
        )}
      </div>

      <div>
        <input
          type="password"
          placeholder="New Password"
          {...register(
            "newPassword"
          )}
          className="w-full border rounded p-3"
        />

        {errors.newPassword && (
          <p className="text-red-500 text-sm mt-1">
            {errors.newPassword.message}
          </p>
        )}
      </div>

      <div>
        <input
          type="password"
          placeholder="Confirm Password"
          {...register(
            "confirmPassword"
          )}
          className="w-full border rounded p-3"
        />

        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">
            {
              errors.confirmPassword
                .message
            }
          </p>
        )}
      </div>

      {error && (
        <p className="text-red-500">
          {error}
        </p>
      )}

      {success && (
        <p className="text-green-500">
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="px-5 py-3 rounded bg-blue-600 text-white"
      >
        {loading
          ? "Updating..."
          : "Change Password"}
      </button>
    </form>
  );
}