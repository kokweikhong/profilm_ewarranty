import { navigation } from "@/constants/navigation";

const allowedPathsForAllRoles = [
  "/admin/users/profile",
  "/admin/users/update-password",
];

/**
 * Check if a user role has access to a specific route
 */
export function hasAccessToRoute(
  userRole: string | undefined,
  pathname: string
): boolean {
  if (!userRole) return false;

  // Allow all authenticated users to access their profile
  if (allowedPathsForAllRoles.includes(pathname)) {
    return true;
  }

  // Find the navigation item that matches the pathname
  const navItem = navigation.find((item) => {
    if (pathname === item.href) return true;
    // Check if pathname is a sub-route of the navigation item
    if (item.href !== "/admin" && pathname.startsWith(item.href + "/"))
      return true;
    return false;
  });

  // If no navigation item found, check if it's the base /admin route
  if (!navItem) {
    // Allow access to /admin base route only for admin role
    if (pathname === "/admin") {
      return userRole === "admin";
    }
    return false;
  }

  // If allowedRoles is not specified, all roles can access
  if (!navItem.allowedRoles) return true;

  // Check if user role is in the allowed roles
  return navItem.allowedRoles.includes(userRole);
}

/**
 * Get the default redirect path for a user based on their role
 */
export function getDefaultRouteForRole(userRole: string): string {
  // Both admin and shop_admin now start at the dashboard
  return "/admin";
}
