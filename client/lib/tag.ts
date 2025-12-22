
const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(
  /\/$/,
  ""
);
const API_ROOT = API_BASE.endsWith("/api") ? API_BASE : `${API_BASE}/api`;
const TAGS_API = `${API_ROOT}/tags`;

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

// ✅ Lấy danh sách tags
export async function getTags() {
  const res = await fetch(`${TAGS_API}/`, {
    credentials: "include",
    method: "GET",
    headers: authHeaders(),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Không thể tải danh sách tags: ${err}`);
  }

  return  res.json();
}

// ✅ Tạo tag mới
export async function createTag(data: { name: string }) {
  const res = await fetch(`${TAGS_API}/`, {
    method: "POST",
    headers: authHeaders(),
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
// ✅ Cập nhật tag
export async function updateTag(id: number, data: { name: string }) {
  const res = await fetch(`${TAGS_API}/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
// ✅ Xóa tag
export async function deleteTag(id: number) {
  const res = await fetch(`${TAGS_API}/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json;
}