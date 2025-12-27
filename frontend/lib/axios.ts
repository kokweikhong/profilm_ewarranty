import axios from "axios";
import { getApiBaseUrl } from "@/lib/env";

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken =
          typeof window !== "undefined"
            ? localStorage.getItem("refreshToken")
            : null;
        if (refreshToken) {
          // Call refresh token endpoint
          const response = await axios.post(`${getApiBaseUrl()}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken } = response.data;
          if (typeof window !== "undefined") {
            localStorage.setItem("accessToken", accessToken);
          }

          // Update cookie as well
          if (typeof window !== "undefined") {
            const expires = new Date();
            expires.setTime(expires.getTime() + 1 * 24 * 60 * 60 * 1000);
            document.cookie = `accessToken=${accessToken};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
          }

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token failed, clear auth and redirect to login
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          document.cookie =
            "accessToken=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
          document.cookie =
            "refreshToken=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";

          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
