const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function getCategories() {
  const res = await fetch(`${API_BASE}/categories`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Không thể tải danh mục");
  return await res.json();
}

export async function createCategory(data: {
  name: string;
  slug: string;
  description: string;
}) {
  const res = await fetch(`${API_BASE}/categories/`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Tạo danh mục thất bại");
  return await res.json();
}

export async function updateCategory(
  id: number,
  data: {
    name: string;
    slug: string;
    description: string;
  }
) {
  const res = await fetch(`${API_BASE}/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Cập nhật danh mục thất bại");
  return await res.json();
}

export async function deleteCategoryApi(id: number) {
  const res = await fetch(`${API_BASE}/categories/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Xóa danh mục thất bại");
  return await res.json();
}
