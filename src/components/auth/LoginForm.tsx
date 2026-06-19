"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import {
  loginSchema,
  type LoginFormData,
} from "@/schemas/login.schema";

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

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const { login, loading, error } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (
    data: LoginFormData
  ) => {
    try {
      await login(data);

      router.push("/dashboard");
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

      <div className="login max-w-[90vw] sm:max-w-md w-full mx-auto">
        <h2>Sign In</h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-3"
        >
          <div className="inputBox">
            <input
              type="email"
              placeholder="Email Address"
              {...register("email")}
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
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
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {error && (
            <p className="text-red-500 text-sm">
              {error}
            </p>
          )}

          <div className="inputBox">
            <button
              type="submit"
              id="btn"
              disabled={loading}
              className="flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="size-4.5 animate-spin" />}
              {loading
                ? "Logging in..."
                : "Login"}
            </button>
          </div>
        </form>

        <div className="group">
          <Link href="/forgot-password">
            Forgot Password
          </Link>

          <Link href="/signup">
            Signup
          </Link>
        </div>
      </div>
    </section>
  );
}