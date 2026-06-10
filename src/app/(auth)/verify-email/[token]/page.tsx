"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { isAxiosError } from "axios";

import { verifyEmail } from "@/services/auth";

export default function VerifyEmailPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const hasVerified = useRef(false);

  const [message, setMessage] = useState(
    "Verifying email..."
  );
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token || hasVerified.current) {
      return;
    }

    hasVerified.current = true;

    const verify = async () => {
      try {
        const response = await verifyEmail(token);

        setSuccess(true);
        setMessage(
          response.message ||
            "Email verified successfully"
        );

        setTimeout(() => {
          router.replace("/login");
        }, 2000);
      } catch (err: unknown) {
        setMessage(
          isAxiosError(err)
            ? (err.response?.data as { message?: string })?.message ||
                "Verification failed"
            : "Verification failed"
        );
      }
    };

    verify();
  }, [token, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1
        className={`text-xl font-semibold ${
          success
            ? "text-green-600"
            : message === "Verifying email..."
              ? "text-foreground"
              : "text-red-500"
        }`}
      >
        {message}
      </h1>

      {success && (
        <p className="text-muted-foreground text-sm">
          Redirecting to login...
        </p>
      )}

      {!success && message !== "Verifying email..." && (
        <Link
          href="/login"
          className="text-sm underline underline-offset-4"
        >
          Back to Login
        </Link>
      )}
    </div>
  );
}
