/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function getPhotos() {
  const res = await fetch(`${API_BASE}/photos/`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Không thể tải danh sách album");
  return await res.json();
}

export async function createPhoto(data: any) {
  const res = await fetch(`${API_BASE}/photos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Không thể tạo photo");
  return await res.json();
}

export async function updatePhoto(id: number, data: any) {
  const res = await fetch(`${API_BASE}/photos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Không thể cập nhật photo");
  return await res.json();
}

export async function deletePhoto(id: number) {
  const res = await fetch(`${API_BASE}/photos/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Không thể xóa photo");
  return await res.json();
}
