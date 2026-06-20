"use client";

import { useState } from "react";

import * as authService from "@/services/auth";
import { setAccessToken, clearAccessToken } from "@/lib/token";
import { useAuthStore } from "@/store/auth.store";
import { getApiErrorMessage } from "@/lib/api-error";

import type {
  LoginDto,
  SignupDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from "@/types/auth";

export const useAuth = () => {
  const { setUser, logout: clearAuth } =
    useAuthStore();

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const login = async (
    data: LoginDto
  ) => {
    try {
      console.log("[useAuth] Starting login...");
      setLoading(true);
      setError(null);

      console.log("[useAuth] Calling authService.login with data:", data);
      const response = await authService.login(data);
      console.log("[useAuth] authService.login response:", response);

      if (response?.data?.user) {
        console.log("[useAuth] Setting user in store:", response.data.user);
        setUser(response.data.user);
      }

      if (response?.data?.accessToken) {
        console.log("[useAuth] Setting access token");
        setAccessToken(response.data.accessToken);
      }

      return response;
    } catch (err: unknown) {
      console.error("[useAuth] Login error:", err);
      setError(getApiErrorMessage(err, "Login failed"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (
    data: SignupDto
  ) => {
    try {
      setLoading(true);
      setError(null);

      return await authService.register(data);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Signup failed"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (
    data: ForgotPasswordDto
  ) => {
    try {
      setLoading(true);
      setError(null);

      return await authService.forgotPassword(
        data
      );
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Request failed"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (
    token: string,
    data: ResetPasswordDto
  ) => {
    try {
      setLoading(true);
      setError(null);

      return await authService.resetPassword(
        token,
        data
      );
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Reset failed"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (
    oldPassword: string,
    newPassword: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      return await authService.changePassword({
        oldPassword,
        newPassword,
      });
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Password change failed"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      clearAccessToken();
      clearAuth();
    }
  };

  return {
    loading,
    error,

    login,
    signup,
    forgotPassword,
    resetPassword,
    logout,
    changePassword,
  };
};