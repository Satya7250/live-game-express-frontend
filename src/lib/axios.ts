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
  baseURL: "/api",
  withCredentials: true,
  timeout: 10_000,
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
  const authPages = ["/login", "/signup", "/forgot-password", "/reset-password", "/verify-email"];
  return authPages.some((page) => window.location.pathname.startsWith(page));
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
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const bypassAuthUrls = ["/auth/login", "/auth/register", "/auth/refresh-token", "/auth/forgot-password", "/auth/reset-password"];
    const url = originalRequest.url;
    const shouldBypass = url && bypassAuthUrls.some((bypassUrl) => url.includes(bypassUrl));

    if (error.response?.status === 401 && !originalRequest._retry && !shouldBypass) {
      if (isRefreshing) {
        return new Promise<void>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest)).catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await api.post("/auth/refresh-token");

        if (refreshResponse.data?.success && refreshResponse.data?.data?.accessToken) {
          setAccessToken(refreshResponse.data.data.accessToken);
        }

        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        clearAccessToken();

        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("auth:session-expired"));

          if (!isAuthPage()) {
            window.location.href = "/login";
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
