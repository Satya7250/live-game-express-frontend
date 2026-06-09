"use client";

import { useState } from "react";

import * as authService from "@/services/auth";
import { useAuthStore } from "@/store/auth.store";

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
      setLoading(true);
      setError(null);

      const response =
        await authService.login(data);

      if (response?.data?.user) {
        setUser(response.data.user);
      }

      return response;
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        "Login failed"
      );
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
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        "Signup failed"
      );
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
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        "Request failed"
      );
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
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        "Reset failed"
      );
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

    return await authService.changePassword(
      {
        oldPassword,
        newPassword,
      }
    );
  } catch (err: any) {
    setError(
      err?.response?.data?.message ||
        "Password change failed"
    );

    throw err;
  } finally {
    setLoading(false);
  }
};

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
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