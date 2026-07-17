import { getDeviceId } from "./deviceId";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

export const apiUrl = (path: string): string => `${API_BASE_URL}${path}`;

export const apiFetch = (path: string, options: RequestInit = {}): Promise<Response> => {
  const headers = new Headers(options.headers);
  headers.set("x-device-id", getDeviceId());

  return fetch(apiUrl(path), {
    ...options,
    headers,
  });
};
