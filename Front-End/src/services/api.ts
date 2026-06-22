/**
 * Centralized API client. Swap MOCK_MODE off (or set VITE_API_BASE_URL) to point
 * the app at a real backend. No component should import axios directly.
 */
export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "";

export const MOCK_MODE = !API_BASE_URL;

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
  }
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    throw new ApiError(`Request failed: ${res.status}`, res.status);
  }
  return (await res.json()) as T;
}

export function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}