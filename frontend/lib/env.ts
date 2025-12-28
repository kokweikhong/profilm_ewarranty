// Client-side API URL (used in browser)
export function getApiUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
}

// Server-side API URL (used in server actions and SSR)
export function getServerApiUrl(): string {
  // Use internal URL if available (for Docker), otherwise fall back to public URL
  return (
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8080"
  );
}

export function getApiBaseUrl(): string {
  // Determine if we're on server or client
  const isServer = typeof window === "undefined";
  const baseUrl = isServer ? getServerApiUrl() : getApiUrl();
  return `${baseUrl}/api/v1`;
}
