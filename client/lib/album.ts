import { AlbumFilters } from "@/types";

/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(
  /\/$/,
  ""
);
const API_ROOT = API_BASE.endsWith("/api") ? API_BASE : `${API_BASE}/api`;
const ALBUMS_API = `${API_ROOT}/albums`;

const getStoredAccessToken = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("auth-storage");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return (
      parsed?.state?.accessToken ||
      parsed?.state?.state?.accessToken ||
      null
    );
  } catch {
    return null;
  }
};

const authHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {};
  const token = getStoredAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

export async function getAlbums(params: {
  page?: number;
  limit?: number;
  filters?:AlbumFilters
}) {
  const query = new URLSearchParams();

  if (params.page) query.append("page", String(params.page));
  if (params.limit) query.append("limit", String(params.limit));
  if (params.filters) {
    Object.entries(params.filters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;

      if (Array.isArray(value)) {
        query.append(key, value.join(","));
      } else {
        query.append(key, String(value));
      }
    });
  }
  
  const res = await fetch(`${ALBUMS_API}?${query.toString()}`, {
    method: "GET",
    credentials: "include",
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}


export async function createAlbum(data: any) {
  const form = new FormData();

  if (data.title) form.append("title", data.title);
  if (data.description) form.append("description", data.description);
  if (data.status) form.append("status", data.status);
  if (data.cover_image instanceof File) {
    form.append("cover_image", data.cover_image);
  }
  if (data.category) {
    form.append("category", data.category.toString());
  }
  if (data.tags && Array.isArray(data.tags)) {
    form.append("tags", JSON.stringify(data.tags));
  }

  const res = await fetch(`${ALBUMS_API}`, {
    method: "POST",
    body: form,
    credentials: "include",
    headers: authHeaders(),
  });

  return res.json();
}

export async function updateAlbum(id: number, data: any) {
  const form = new FormData();

  if (data.title) form.append("title", data.title);
  if (data.description) form.append("description", data.description);
  if (data.status) form.append("status", data.status);
  if (data.cover_image instanceof File) {
    form.append("cover_image", data.cover_image);
  }
  if (data.tags && Array.isArray(data.tags)) {
    form.append("tags", JSON.stringify(data.tags));
  }
  if (data.category) {
    form.append("category", data.category.toString());
  }

  const res = await fetch(`${ALBUMS_API}/${id}`, {
    method: "PUT",
    body: form,
    credentials: "include",
    headers: authHeaders(),
  });

  return res.json();
}


export async function deleteAlbum(id: number) {
  const res = await fetch(`${ALBUMS_API}/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Không thể xóa album");
  return res.json();
}
