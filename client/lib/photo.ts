/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ✅ Lấy danh sách ảnh
export async function getPhotos(
  page: number = 1,
  limit: number = 10,
  search?: string
) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (search) params.append("search", search);

  const res = await fetch(`${API_BASE}/photos?${params.toString()}`, {
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Không thể tải danh sách ảnh: ${err}`);
  }

  return await res.json(); // trả về { total, page, limit, total_pages, data }
}


// ✅ Tạo ảnh (FormData hoặc JSON)
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
