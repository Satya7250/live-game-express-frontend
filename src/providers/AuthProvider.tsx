"use client";

import { useEffect } from "react";

import { getMe, refreshToken } from "@/services/auth";
import { useAuthStore } from "@/store/auth.store";
import {
  getCachedAccessToken,
  setAccessToken,
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
        if (!getCachedAccessToken()) {
          const refreshResponse = await refreshToken();
          if (
            refreshResponse.success &&
            refreshResponse.data &&
            refreshResponse.data.accessToken
          ) {
            setAccessToken(refreshResponse.data.accessToken);
            if (refreshResponse.data.user) {
              setUser(refreshResponse.data.user);
              return;
            }
          }
        }

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

  return <>{children}</>;
}
