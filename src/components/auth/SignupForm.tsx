"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import {
  signupSchema,
  type SignupFormData,
} from "@/schemas/signup.schema";

import { useAuth } from "@/hooks/useAuth";
import AvatarUpload from "./avatar-upload";

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

export default function SignupForm() {
  const router = useRouter();
  const { signup, loading: authLoading, error } = useAuth();

  const [imageUploading, setImageUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "player",
      avatar: "",
      phone: "",
      address: "",
      bio: "",
    },
  });

  const onSubmit = async (
    data: SignupFormData
  ) => {
    try {
      const { confirmPassword, ...signupData } = data;

      const response = await signup(signupData);

      toast.success(
        response.message ||
          "Account created! Check your email to verify your account before logging in."
      );

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: unknown) {
      toast.error(
        isAxiosError(err)
          ? (err.response?.data as { message?: string })?.message ||
              "Registration failed. Please try again."
          : "Registration failed. Please try again."
      );
    }
  };

  const buttonText = imageUploading
    ? "Uploading Image..."
    : authLoading
    ? "Creating Account..."
    : "Sign Up";

  const isSubmitting =
    imageUploading || authLoading;

  return (
    <section className="hero">
      <Image
        src="/bg.jpg"
        alt="Background"
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
        className="girl"
      />

      <Image
        src="/trees.png"
        alt=""
        aria-hidden="true"
        fill
        className="trees"
      />

      <div className="login max-w-[90vw] sm:max-w-2xl w-full mx-auto">
        <h2>Sign Up</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Avatar Upload */}
          <div className="mb-6">
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

            {errors.avatar && (
              <p className="mt-2 text-center text-sm text-red-500">
                {errors.avatar.message}
              </p>
            )}
          </div>

          <div className="form-grid">
            <div className="inputBox">
              <input
                type="text"
                placeholder="Full Name"
                {...register("name")}
              />

              {errors.name && (
                <p className="text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="inputBox">
              <input
                type="email"
                placeholder="Email Address"
                {...register("email")}
              />

              {errors.email && (
                <p className="text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Role defaults to player in defaultValues, developer role hidden until features implemented */}

            <div className="inputBox">
              <input
                type="tel"
                placeholder="Phone Number (optional)"
                {...register("phone")}
              />

              {errors.phone && (
                <p className="text-sm text-red-500">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="inputBox relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="pr-10"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8f2c24] hover:text-[#d64c42] focus:outline-none cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="size-4.5" />
                ) : (
                  <Eye className="size-4.5" />
                )}
              </button>

              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="inputBox relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="pr-10"
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8f2c24] hover:text-[#d64c42] focus:outline-none cursor-pointer"
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-4.5" />
                ) : (
                  <Eye className="size-4.5" />
                )}
              </button>

              {errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="inputBox">
              <input
                type="text"
                placeholder="Address (optional)"
                {...register("address")}
              />

              {errors.address && (
                <p className="text-sm text-red-500">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div className="inputBox">
              <textarea
                rows={2}
                placeholder="Bio (optional)"
                {...register("bio")}
              />

              {errors.bio && (
                <p className="text-sm text-red-500">
                  {errors.bio.message}
                </p>
              )}
            </div>
          </div>

          {error && (
            <p className="mt-3 text-sm text-red-500">
              {error}
            </p>
          )}

          <div className="inputBox mt-3">
            <button
              type="submit"
              id="btn"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 className="size-4.5 animate-spin" />}
              {buttonText}
            </button>
          </div>
        </form>

        <div className="group">
          <Link href="/login">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </section>
  );
}