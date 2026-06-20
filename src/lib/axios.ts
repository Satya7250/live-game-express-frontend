import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

import {
  getCachedAccessToken,
  setAccessToken,
  clearAccessToken,
} from "@/lib/token";

const api = axios.create({
  baseURL: typeof window !== "undefined" ? "/api" : process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;

let failedQueue: Array<{
  resolve: () => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });

  failedQueue = [];
};


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

    const bypassAuthUrls = [
      "/auth/login",
      "/auth/register",
      "/auth/refresh-token",
      "/auth/forgot-password",
      "/auth/reset-password",
    ];

    const url = originalRequest?.url ?? "";

    const shouldBypass = bypassAuthUrls.some((bypassUrl) =>
      url.includes(bypassUrl)
    );

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !shouldBypass
    ) {
      if (isRefreshing) {
        return new Promise<void>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await api.post(
          "/auth/refresh-token"
        );

        if (
          refreshResponse.data?.success &&
          refreshResponse.data?.data?.accessToken
        ) {
          setAccessToken(
            refreshResponse.data.data.accessToken
          );
        }

        processQueue(null);

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);

        clearAccessToken();

        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("auth:session-expired")
          );

          const isDashboardPage = window.location.pathname.startsWith("/dashboard");
          if (isDashboardPage) {
            const currentPath = window.location.pathname + window.location.search;
            window.location.href = `/login?from=${encodeURIComponent(currentPath)}`;
          }
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;