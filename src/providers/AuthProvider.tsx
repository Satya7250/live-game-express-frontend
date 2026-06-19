"use client";

import { useEffect } from "react";

import { getMe } from "@/services/auth";
import { useAuthStore } from "@/store/auth.store";
import {
  clearAccessToken,
} from "@/lib/token";

interface Props {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: Props) {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const meResponse = await getMe();
        if (meResponse.success && meResponse.data) {
          setUser(meResponse.data);
        }
      } catch (error) {
        clearAccessToken();
        setUser(null);
      }
    };

    initializeAuth();
  }, [setUser]);

  useEffect(() => {
    const handleSessionExpired = () => {
      clearAccessToken();
      setUser(null);
    };

    window.addEventListener("auth:session-expired", handleSessionExpired);
    return () => {
      window.removeEventListener("auth:session-expired", handleSessionExpired);
    };
  }, [setUser]);

  return <>{children}</>;
}
