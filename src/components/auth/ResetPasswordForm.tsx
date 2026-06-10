"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/schemas/reset-password.schema";

import { useAuth } from "@/hooks/useAuth";

const LEAVES = [
  "/leaf_01.png",
  "/leaf_02.png",
  "/leaf_03.png",
  "/leaf_04.png",
  "/leaf_01.png",
  "/leaf_02.png",
  "/leaf_03.png",
  "/leaf_04.png",
];

export default function ResetPasswordForm() {
  const router = useRouter();
  const params = useParams();

  const token = params.token as string;

  const {
    resetPassword,
    loading,
    error,
  } = useAuth();

  const [success, setSuccess] =
    useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(
      resetPasswordSchema
    ),
  });

  const onSubmit = async (
    data: ResetPasswordFormData
  ) => {
    try {
      const response =
        await resetPassword(token, {
          password: data.password,
        });

      setSuccess(response.message);

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="hero">
      <Image
        src="/bg.jpg"
        alt="background"
        fill
        priority
        className="bg"
      />

      <div className="leaves">
        <div className="set">
          {LEAVES.map((leaf, index) => (
            <div key={`${leaf}-${index}`}>
              <Image
                src={leaf}
                alt=""
                aria-hidden="true"
                width={80}
                height={80}
                priority
                style={{
                  width: "auto",
                  height: "auto",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <Image
        src="/girl.png"
        alt=""
        aria-hidden="true"
        width={500}
        height={500}
        priority
        className="girl"
      />

      <Image
        src="/trees.png"
        alt=""
        aria-hidden="true"
        fill
        priority
        className="trees"
      />

      <div className="login">
        <h2>Reset Password</h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-3"
        >
          <div className="inputBox">
            <input
              type="password"
              placeholder="New Password"
              {...register("password")}
            />

            {errors.password && (
              <p className="text-red-500 text-sm">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="inputBox">
            <input
              type="password"
              placeholder="Confirm Password"
              {...register(
                "confirmPassword"
              )}
            />

            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {
                  errors.confirmPassword
                    .message
                }
              </p>
            )}
          </div>

          {error && (
            <p className="text-red-500 text-sm">
              {error}
            </p>
          )}

          {success && (
            <p className="text-green-500 text-sm">
              {success}
            </p>
          )}

          <div className="inputBox">
            <button
              type="submit"
              id="btn"
              disabled={loading}
            >
              {loading
                ? "Resetting..."
                : "Reset Password"}
            </button>
          </div>
        </form>

        <div className="group">
          <Link href="/login">
            Back to Login
          </Link>
        </div>
      </div>
    </section>
  );
}