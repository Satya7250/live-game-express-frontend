import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

import { useAuthStore } from "@/store/auth.store";
import {
  getCachedAccessToken,
  setAccessToken,
  clearAccessToken,
} from "@/lib/token";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;

let failedQueue: Array<{
  resolve: () => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (
  error: unknown
) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });

  failedQueue = [];
};

const isAuthPage = () => {
  if (typeof window === "undefined") {
    return false;
  }

  const authPages = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
  ];

  return authPages.some((page) =>
    window.location.pathname.startsWith(page)
  );
};

// Request interceptor: add access token to headers
api.interceptors.request.use(
  (config) => {
    const token = getCachedAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest =
      error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise<void>(
          (resolve, reject) => {
            failedQueue.push({
              resolve,
              reject,
            });
          }
        )
          .then(() => api(originalRequest))
          .catch((err) =>
            Promise.reject(err)
          );
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await api.post(
          "/auth/refresh-token"
        );

        // Save the new access token
        if (
          refreshResponse.data?.success &&
          refreshResponse.data?.data?.accessToken
        ) {
          setAccessToken(refreshResponse.data.data.accessToken);
        }

        processQueue(null);

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        clearAccessToken();

        const { logout } =
          useAuthStore.getState();

        logout();

        if (
          typeof window !==
            "undefined" &&
          !isAuthPage()
        ) {
          window.location.href =
            "/login";
        }

        return Promise.reject(
          refreshError
        );
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;