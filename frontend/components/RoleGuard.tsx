"use client";

import { useAuth } from "@/contexts/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  hasAccessToRoute,
  getDefaultRouteForRole,
} from "@/lib/utils/roleUtils";

export default function RoleGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (isLoading) return;

    // If no user, AuthContext will handle redirect to login
    if (!user) {
      setIsChecking(false);
      return;
    }

    // Check if user has access to current route
    const hasAccess = hasAccessToRoute(user.role, pathname);

    if (!hasAccess) {
      // Redirect to default route for their role
      const defaultRoute = getDefaultRouteForRole(user.role);
      router.push(defaultRoute);
    } else {
      setIsChecking(false);
    }
  }, [user, isLoading, pathname, router]);

  // Show loading state while checking permissions or auth is loading
  if (isLoading || (isChecking && user)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  // If no user, don't render (AuthContext will handle redirect)
  if (!user) {
    return null;
  }

  // Render children once access is verified
  return <>{children}</>;
}
