/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function getAlbums() {
  const res = await fetch(`${API_BASE}/albums/`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Không thể tải danh sách album");
  return await res.json();
}

export async function createAlbum(data: any) {
  const res = await fetch(`${API_BASE}/albums`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Không thể tạo album");
  return await res.json();
}

export async function updateAlbum(id: number, data: any) {
  const res = await fetch(`${API_BASE}/albums/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Không thể cập nhật album");
  return await res.json();
}

export async function deleteAlbum(id: number) {
  const res = await fetch(`${API_BASE}/albums/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Không thể xóa album");
  return await res.json();
}
