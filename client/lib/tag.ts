
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ✅ Lấy danh sách tags
export async function getTags() {
  const res = await fetch(`${API_BASE}/tags`, {
    credentials: "include",
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Không thể tải danh sách tags: ${err}`);
  }

  return await res.json();
}

// ✅ Tạo tag mới
export async function createTag(data: { name: string }) {
  const res = await fetch(`${API_BASE}/tags`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}
// ✅ Cập nhật tag
export async function updateTag(id: number, data: { name: string }) {
  const res = await fetch(`${API_BASE}/tags/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}
// ✅ Xóa tag
export async function deleteTag(id: number) {
  const res = await fetch(`${API_BASE}/tags/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return;
}