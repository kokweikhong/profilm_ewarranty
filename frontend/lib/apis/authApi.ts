import apiClient from "@/lib/axios";
import { ListUsersResponse } from "@/types/usersType";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    username: string;
    shopId: number | null;
    role: string;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export async function loginApi(
  credentials: LoginRequest
): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>(
    "/auth/login",
    credentials
  );
  return response.data;
}

export async function refreshTokenApi(
  request: RefreshTokenRequest
): Promise<RefreshTokenResponse> {
  const response = await apiClient.post<RefreshTokenResponse>(
    "/auth/refresh",
    request
  );
  return response.data;
}

export async function updatePasswordApi(
  userId: number,
  newPassword: string
): Promise<void> {
  await apiClient.put(`/users/${userId}/password`, {
    newPassword,
  });
}

export async function getUsersApi(): Promise<ListUsersResponse[]> {
  const response = await apiClient.get<ListUsersResponse[]>("/users");
  return response.data;
}

export async function resetPasswordApi(userId: number): Promise<void> {
  await apiClient.post(`/users/${userId}/reset-password`);
}
