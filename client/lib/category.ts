const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(
  /\/$/,
  ""
);
const API_ROOT = API_BASE.endsWith("/api") ? API_BASE : `${API_BASE}/api`;
const CATEGORIES_API = `${API_ROOT}/categories`;

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
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = getStoredAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

export async function getCategories() {
  const res = await fetch(`${CATEGORIES_API}`, {
    method: "GET",
    credentials: "include",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Không thể tải danh mục");
  return res.json();
}

export async function createCategory(data: {
  name: string;
  slug: string;
  description: string;
}) {
  const res = await fetch(`${CATEGORIES_API}`, {
    method: "POST",
    credentials: "include",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Tạo danh mục thất bại");
  return res.json();
}

export async function updateCategory(
  id: number,
  data: {
    name: string;
    slug: string;
    description: string;
  }
) {
  const res = await fetch(`${CATEGORIES_API}/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Cập nhật danh mục thất bại");
  return res.json();
}

export async function deleteCategoryApi(id: number) {
  const res = await fetch(`${CATEGORIES_API}/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Xóa danh mục thất bại");
  return res.json();
}
