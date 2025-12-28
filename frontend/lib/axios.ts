import axios from "axios";
import { getApiBaseUrl } from "@/lib/env";

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper function to get token from cookies (works in both client and server)
function getTokenFromCookies(): string | null {
  if (typeof document !== "undefined") {
    // Client-side: use document.cookie
    const cookies = document.cookie.split("; ");
    const tokenCookie = cookies.find((c) => c.startsWith("accessToken="));
    return tokenCookie ? tokenCookie.split("=")[1] : null;
  }
  return null;
}

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    let token: string | null = null;

    if (typeof window !== "undefined") {
      // Client-side: try localStorage first, then cookies
      token = localStorage.getItem("accessToken") || getTokenFromCookies();
    } else {
      // Server-side: check if token is passed through headers (we'll set this up)
      // For now, server-side requests won't have automatic token injection
      // They need to be handled differently
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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

// Server-side API client factory that accepts a token
export function createServerApiClient(token?: string) {
  const serverClient = axios.create({
    baseURL: getApiBaseUrl(),
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return serverClient;
}

// Helper to get server API client with token from cookies
export async function getServerApiClient() {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  return createServerApiClient(token);
}

export default apiClient;
