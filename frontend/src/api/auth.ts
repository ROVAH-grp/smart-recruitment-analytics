import { apiFetch } from "./client";

export type UserRole = "ADMIN" | "RECRUITER" | "CANDIDATE";

export interface AuthUser {
  userId: number;
  email: string;
  role: UserRole;
  candidateId: string | null;
  recruiterId: number | null;
  createdAt: string;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export interface RegisterResponse {
  message: string;
  user: AuthUser;
}

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const response = await apiFetch<{ data: LoginResponse }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  return response.data;
}

export async function register(data: {
  email: string;
  password: string;
  role: UserRole;
  candidateId?: string;
  recruiterId?: number;
}): Promise<RegisterResponse> {
  const response = await apiFetch<{ data: RegisterResponse }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return response.data;
}