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
  const form = new FormData();

  if (data.title) form.append("title", data.title);
  if (data.description) form.append("description", data.description);
  if (data.status) form.append("status", data.status);
  if (data.cover_image instanceof File) {
    form.append("cover_image", data.cover_image);
  }

  const res = await fetch(`${API_BASE}/albums`, {
    method: "POST",
    body: form,
    credentials: "include",
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

  const res = await fetch(`${API_BASE}/albums/${id}`, {
    method: "PUT",
    body: form,
    credentials: "include",
  });

  return res.json();
}


export async function deleteAlbum(id: number) {
  const res = await fetch(`${API_BASE}/albums/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Không thể xóa album");
  return await res.json();
}
