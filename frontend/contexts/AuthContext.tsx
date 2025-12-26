"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { loginApi, refreshTokenApi } from "@/lib/apis/authApi";
import { setCookie, deleteCookie } from "@/lib/utils/cookies";

interface User {
  id: number;
  username: string;
  shopId: number | null;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check if user is authenticated on mount
  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Failed to parse user data:", error);
          handleLogout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Redirect to login if not authenticated and on admin route
  useEffect(() => {
    if (!isLoading && !user && pathname.startsWith("/admin")) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, isLoading, pathname, router]);

  const login = async (username: string, password: string) => {
    try {
      const response = await loginApi({ username, password });

      // Store tokens and user data in localStorage
      localStorage.setItem(TOKEN_KEY, response.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));

      // Also store tokens and user data in cookies for server-side access (proxy.ts)
      setCookie(TOKEN_KEY, response.accessToken, { days: 1 }); // 1 day (access token expires in 15 min but we refresh it)
      setCookie(REFRESH_TOKEN_KEY, response.refreshToken, { days: 7 }); // 7 days
      setCookie(USER_KEY, JSON.stringify(response.user), { days: 7 }); // Store user data for middleware

      setUser(response.user);
      // Note: Redirect is now handled by the login page component
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    // Also remove cookies
    deleteCookie(TOKEN_KEY);
    deleteCookie(REFRESH_TOKEN_KEY);
    deleteCookie(USER_KEY);

    setUser(null);
  };

  const logout = () => {
    handleLogout();
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
