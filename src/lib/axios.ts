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
  (response) => {
    console.log("[Axios] Response received:", {
      url: response.config.url,
      status: response.status,
      headers: response.headers,
      data: response.data
    });
    
    // Log Set-Cookie headers specifically for auth endpoints
    const authUrls = ["/auth/login", "/auth/register", "/auth/refresh-token"];
    if (response.config.url && authUrls.some(u => response.config.url!.includes(u))) {
      console.log("[Axios] Auth endpoint response headers:", Object.fromEntries(Object.entries(response.headers)));
      console.log("[Axios] Set-Cookie headers (from getAllResponseHeaders):", response.headers['set-cookie']);
      
      // Try to access headers via getAllResponseHeaders if available (for browser)
      if (typeof response.request !== 'undefined' && 'getAllResponseHeaders' in response.request) {
        console.log("[Axios] All response headers (raw):", (response.request as any).getAllResponseHeaders());
      }
    }
    
    return response;
  },

  async (error: AxiosError) => {
    console.error("[Axios] Error response:", {
      url: error.config?.url,
      status: error.response?.status,
      headers: error.response?.headers,
      data: error.response?.data
    });
    
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

    const url = originalRequest.url;
    const shouldBypass = url && bypassAuthUrls.some((bypassUrl) => url.includes(bypassUrl));

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
