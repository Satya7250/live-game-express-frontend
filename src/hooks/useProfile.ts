"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api-error";
import * as userService from "@/services/user";
import { useAuthStore } from "@/store/auth.store";
import type { ProfileFormData } from "@/schemas/profile.schema";
import type { Profile } from "@/types/user";

export function useProfile() {
  const setUser = useAuthStore((state) => state.setUser);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await userService.getProfile();

      if (response.success && response.data) {
        setProfile(response.data);
        setUser(response.data);
        return response.data;
      }

      throw new Error(response.message || "Failed to load profile");
    } catch (err: unknown) {
      const message = getApiErrorMessage(err, "Failed to load profile");
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  useEffect(() => {
    void fetchProfile();
  }, [fetchProfile]);

  const updateProfile = useCallback(
    async (data: ProfileFormData) => {
      const response = await userService.updateProfile(data);

      if (response.success && response.data) {
        setProfile(response.data);
        setUser(response.data);
        return response;
      }

      const currentUser = useAuthStore.getState().user;

      if (currentUser) {
        const mergedUser = { ...currentUser, ...data };
        setProfile(mergedUser);
        setUser(mergedUser);
      }

      return response;
    },
    [setUser]
  );

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
  };
}
