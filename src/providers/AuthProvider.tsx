"use client";

import { useEffect } from "react";

import { getMe } from "@/services/auth";
import { useAuthStore } from "@/store/auth.store";

interface Props {
  children: React.ReactNode;
}

export default function AuthProvider({
  children,
}: Props) {
  const setUser = useAuthStore(
    (state) => state.setUser
  );

  useEffect(() => {
    const initializeAuth =
      async () => {
        try {
          const response =
            await getMe();

          if (
            response.success &&
            response.data
          ) {
            setUser(response.data);
          }
        } catch (error) {
          setUser(null);
        }
      };

    initializeAuth();
  }, [setUser]);

  return <>{children}</>;
}