"use client";

import Image from "next/image";
import Link from "next/link";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  signupSchema,
  type SignupFormData,
} from "@/schemas/signup.schema";

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

export default function SignupForm() {
  const { signup, loading, error } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: "player",
    },
  });

  const onSubmit = async (
    data: SignupFormData
  ) => {
    try {
      const response = await signup(data);

      console.log("Signup Success", response);

      // router.push("/login");
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
        <h2>Sign Up</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-grid">
            <div className="inputBox">
              <input
                type="text"
                placeholder="Full Name"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">
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
                <p className="text-red-500 text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="inputBox">
              <select {...register("role")}>
                <option value="player">
                  Player
                </option>
                <option value="developer">
                  Developer
                </option>
              </select>
            </div>

            <div className="inputBox">
              <input
                type="tel"
                placeholder="Phone Number (optional)"
                {...register("phone")}
              />
            </div>

            <div className="inputBox">
              <input
                type="text"
                placeholder="Avatar URL (optional)"
                {...register("avatar")}
              />
            </div>

            <div className="inputBox">
              <input
                type="text"
                placeholder="Address (optional)"
                {...register("address")}
              />
              {errors.address && (
                <p className="text-red-500 text-sm">
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
                <p className="text-red-500 text-sm">
                  {errors.bio.message}
                </p>
              )}
            </div>

            <div className="inputBox">
              <input
                type="password"
                placeholder="Password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm mt-3">
              {error}
            </p>
          )}

          <div className="inputBox mt-3">
            <button
              type="submit"
              id="btn"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Signup"}
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