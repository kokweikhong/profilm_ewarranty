export function getApiUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
}

export function getApiBaseUrl(): string {
  return `${getApiUrl()}/api/v1`;
}
