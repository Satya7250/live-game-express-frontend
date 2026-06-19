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
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 10_000, // 10 seconds — prevents infinite hangs when backend is down
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

// Request interceptor: attach access token to Authorization header
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
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh-token"
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
        const refreshResponse = await api.post("/auth/refresh-token");

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

        // Dispatch a custom event so the React tree can handle logout cleanly,
        // avoiding the Zustand-outside-React lifecycle race condition.
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("auth:session-expired"));

          if (!isAuthPage()) {
            window.location.href = "/login";
          }
        }

        return Promise.reject(refreshError);
      } finally {
        // Always reset the flag — even if an unexpected error occurs
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;