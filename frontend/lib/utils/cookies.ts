/**
 * Cookie utility functions for client-side cookie management
 * Used by AuthContext to store authentication tokens
 */

export interface CookieOptions {
  days?: number;
  path?: string;
  sameSite?: "Strict" | "Lax" | "None";
  secure?: boolean;
}

/**
 * Set a cookie with the given name and value
 * @param name - Cookie name
 * @param value - Cookie value
 * @param options - Cookie options (days, path, sameSite, secure)
 */
export function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): void {
  const { days = 7, path = "/", sameSite = "Lax", secure = false } = options;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  const cookieParts = [
    `${name}=${value}`,
    `expires=${expires.toUTCString()}`,
    `path=${path}`,
    `SameSite=${sameSite}`,
  ];

  if (secure) {
    cookieParts.push("Secure");
  }

  document.cookie = cookieParts.join(";");
}

/**
 * Get a cookie value by name
 * @param name - Cookie name
 * @returns Cookie value or null if not found
 */
export function getCookie(name: string): string | null {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length);
    }
  }

  return null;
}

/**
 * Delete a cookie by name
 * @param name - Cookie name
 * @param path - Cookie path (must match the path used when setting)
 */
export function deleteCookie(name: string, path: string = "/"): void {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=${path};`;
}

/**
 * Check if a cookie exists
 * @param name - Cookie name
 * @returns True if cookie exists, false otherwise
 */
export function hasCookie(name: string): boolean {
  return getCookie(name) !== null;
}
