import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Define routes that should be protected
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

// Define route permissions by role
const ROUTE_PERMISSIONS: Record<string, string[]> = {
  "/admin": ["admin", "shop_admin"],
  "/admin/products": ["admin"],
  "/admin/product-allocations": ["admin"],
  "/admin/shops": ["admin"],
  "/admin/warranties": ["admin", "shop_admin"],
  "/admin/claims": ["admin", "shop_admin"],
};

interface User {
  id: number;
  username: string;
  shopId: number | null;
  role: string;
}

// Get user data from cookies
async function getUser(request: NextRequest): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return null;
  }

  // In a real implementation, you might decode the JWT token to get user info
  // For now, we'll try to get user data from another cookie or localStorage
  // Since we can't access localStorage in middleware, we'll need to pass user data through cookies
  // The frontend should store user data in a cookie when logging in

  // Try to get user from cookie (this should be set during login)
  const userCookie = request.cookies.get("user")?.value;
  if (userCookie) {
    try {
      return JSON.parse(userCookie);
    } catch (error) {
      return null;
    }
  }

  return null;
}

// Check if user is authenticated by validating token
async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const user = await getUser(request);
  return user !== null;
}

// Check if user has access to a specific route
function hasRouteAccess(userRole: string, pathname: string): boolean {
  // Find the matching route pattern
  let matchedRoute = null;

  // Check exact match first
  if (ROUTE_PERMISSIONS[pathname]) {
    matchedRoute = pathname;
  } else {
    // Check if pathname starts with any defined route (including sub-paths)
    for (const route of Object.keys(ROUTE_PERMISSIONS)) {
      if (pathname === route || pathname.startsWith(route + "/")) {
        matchedRoute = route;
        break;
      }
    }
  }

  // If no specific route matched, check if it's under /admin
  if (!matchedRoute && pathname.startsWith("/admin")) {
    matchedRoute = "/admin";
  }

  // If still no match, allow access (for non-admin routes)
  if (!matchedRoute) {
    return true;
  }

  const allowedRoles = ROUTE_PERMISSIONS[matchedRoute];
  return allowedRoles ? allowedRoles.includes(userRole) : true;
}

// Get default route for a user role
function getDefaultRouteForRole(role: string): string {
  return "/admin"; // Both roles can access dashboard now
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (pathname === "/" || pathname === "/login") {
    // If authenticated and trying to access login, redirect to admin
    if (pathname === "/login" && (await isAuthenticated(request))) {
      const user = await getUser(request);
      const defaultRoute = user ? getDefaultRouteForRole(user.role) : "/admin";
      return NextResponse.redirect(new URL(defaultRoute, request.url));
    }
    return NextResponse.next();
  }

  // Skip middleware for Next.js internals and static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check authentication for protected routes
  const user = await getUser(request);
  console.log("Middleware - User:", user);
  if (!user) {
    // Not authenticated, redirect to login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check role-based access
  const hasAccess = hasRouteAccess(user.role, pathname);
  if (!hasAccess) {
    // User doesn't have access, redirect to their default route
    const defaultRoute = getDefaultRouteForRole(user.role);

    // Avoid redirect loop - if already at default route, just block access
    if (pathname === defaultRoute) {
      return new NextResponse("Access Denied", { status: 403 });
    }

    return NextResponse.redirect(new URL(defaultRoute, request.url));
  }

  // Authenticated and authorized, allow access
  return NextResponse.next();
}
