import { BASE_URL } from "./api";

// DRF TokenAuthentication: sent as `Authorization: Token <token>`.
const TOKEN_KEY = "tradeplay-token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // ignore
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  /** Attach the auth token. Defaults to true; pass false for public routes. */
  auth?: boolean;
}

// Mirrors getJson() in api.ts, but supports POST/DELETE, token auth, and
// surfaces DRF error bodies (e.g. { "detail": "Invalid credentials." } or
// { "username": ["A user with that username already exists."] }).
export async function apiRequest<T>(
  path: string,
  opts: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, auth = true } = opts;

  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Token ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(errorMessage(data, `${res.status} ${res.statusText}`));
  }
  return data as T;
}

// Pull the first human-readable message out of a DRF error response.
function errorMessage(data: unknown, fallback: string): string {
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    if (typeof d.detail === "string") return d.detail;
    const first = Object.values(d)[0];
    if (Array.isArray(first) && typeof first[0] === "string") return first[0];
    if (typeof first === "string") return first;
  }
  return fallback;
}
