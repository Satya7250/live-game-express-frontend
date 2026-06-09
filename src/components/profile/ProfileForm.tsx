"use client";

import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  profileSchema,
  type ProfileFormData,
} from "@/schemas/profile.schema";

import * as userService from "@/services/user";

interface Props {
  defaultValues?: ProfileFormData;
}

export default function ProfileForm({
  defaultValues,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(
      profileSchema
    ),
    defaultValues,
  });

  const onSubmit = async (
    data: ProfileFormData
  ) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response =
        await userService.updateProfile(
          data
        );

      setSuccess(response.message);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Profile update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <div>
        <input
          placeholder="Name"
          {...register("name")}
          className="border p-2 rounded w-full"
        />

        {errors.name && (
          <p className="text-red-500 text-sm">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <input
          placeholder="Phone"
          {...register("phone")}
          className="border p-2 rounded w-full"
        />
      </div>

      <div>
        <input
          placeholder="Avatar URL"
          {...register("avatar")}
          className="border p-2 rounded w-full"
        />
      </div>

      <div>
        <input
          placeholder="Address"
          {...register("address")}
          className="border p-2 rounded w-full"
        />
      </div>

      <div>
        <textarea
          placeholder="Bio"
          {...register("bio")}
          className="border p-2 rounded w-full"
          rows={4}
        />
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
        className="px-4 py-2 rounded bg-blue-600 text-white"
      >
        {loading
          ? "Updating..."
          : "Update Profile"}
      </button>
    </form>
  );
}