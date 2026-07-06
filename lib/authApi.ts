import { apiRequest, setToken, clearToken } from "./request";

export interface AuthUser {
  id: number;
  username: string;
  email: string;
}

interface AuthResponse {
  token: string;
  user: AuthUser;
}

export async function register(
  username: string,
  email: string,
  password: string
): Promise<AuthUser> {
  const res = await apiRequest<AuthResponse>("/auth/register/", {
    method: "POST",
    body: { username, email, password },
    auth: false,
  });
  setToken(res.token);
  return res.user;
}

export async function login(
  username: string,
  password: string
): Promise<AuthUser> {
  const res = await apiRequest<AuthResponse>("/auth/login/", {
    method: "POST",
    body: { username, password },
    auth: false,
  });
  setToken(res.token);
  return res.user;
}

export async function fetchMe(): Promise<AuthUser> {
  return apiRequest<AuthUser>("/auth/me/");
}

export async function logout(): Promise<void> {
  try {
    await apiRequest<void>("/auth/logout/", { method: "POST" });
  } finally {
    // Discard the token client-side even if the server call fails.
    clearToken();
  }
}
