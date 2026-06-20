"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useAuthStore } from "@/store/auth.store";

interface Props {
  children: React.ReactNode;
}

function ProtectedRouteContent({ children }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    console.log("[ProtectedRoute] Setting hydrated to true");
    setHydrated(true);
  }, []);

  useEffect(() => {
    console.log("[ProtectedRoute] useEffect triggered - hydrated:", hydrated, "isAuthenticated:", isAuthenticated);
    if (hydrated && !isAuthenticated) {
      console.log("[ProtectedRoute] Not authenticated, redirecting to login");
      // Preserve the intended destination so we can redirect back after login
      const from = searchParams.get("from") ?? "/dashboard";
      router.replace(`/login?from=${encodeURIComponent(from)}`);
    } else if (hydrated && isAuthenticated) {
      console.log("[ProtectedRoute] Authenticated, rendering children");
    }
  }, [hydrated, isAuthenticated, router, searchParams]);

  // Show a full-screen branded spinner while store hydrates from localStorage
  if (!hydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

export default function ProtectedRoute({ children }: Props) {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-background">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <ProtectedRouteContent>{children}</ProtectedRouteContent>
    </Suspense>
  );
}