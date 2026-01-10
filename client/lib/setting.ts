/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/api/settings.ts
import { SettingResponse } from "@/types/setting.types";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
).replace(/\/$/, "");
const API_ROOT = API_BASE.endsWith("/api") ? API_BASE : `${API_BASE}/api`;
const SETTING_API = `${API_ROOT}/settings`;

const getStoredAccessToken = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("auth-storage");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return (
      parsed?.state?.accessToken || parsed?.state?.state?.accessToken || null
    );
  } catch {
    return null;
  }
};

const authHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = getStoredAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

// GET SETTINGS
export async function getSettings(): Promise<SettingResponse> {
  const res = await fetch(`${SETTING_API}`, {
    credentials: "include",
    headers: authHeaders(),
    cache: "force-cache",
    next: { revalidate: 3600, tags: ["settings"], },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch settings");
  }

  return res.json();
}

// CREATE SETTINGS
export async function createSettings(
  payload: any
): Promise<SettingResponse> {
  const res = await fetch(`${SETTING_API}`, {
    method: "POST",
    headers: authHeaders(),
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to create settings");
  }

  return res.json();
}

// UPDATE SETTING
export async function updateSettings(
  id: number,
  payload: any
): Promise<SettingResponse> {
  const res = await fetch(`${SETTING_API}/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to update settings");
  }

  return res.json();
}