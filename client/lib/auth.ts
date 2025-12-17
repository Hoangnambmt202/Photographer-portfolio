const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(
  /\/$/,
  ""
);
const API_ROOT = API_BASE.endsWith("/api") ? API_BASE : `${API_BASE}/api`;
const API_PREFIX = `${API_ROOT}/auth`;

const getStoredAccessToken = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("auth-storage");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return (
      parsed?.state?.accessToken ||
      parsed?.state?.state?.accessToken || // fallback for persisted shape
      null
    );
  } catch {
    return null;
  }
};

const authHeaders = (token?: string): Record<string, string> => {
  const headers: Record<string, string> = {};
  const accessToken = token || getStoredAccessToken();
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  return headers;
};

//****************************
// LOGIN ADMIN
//************************ */ */
export async function loginAdmin(email: string, password: string) {
  const body = new URLSearchParams({ email, password });
  const res = await fetch(`${API_PREFIX}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    credentials: "include",
    body,
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Đăng nhập thất bại");
  }
  return res.json();
}
//****************************
// LOGOUT ADMIN
//************************ */ */
export async function logoutAdmin() {
  const res = await fetch(`${API_PREFIX}/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Đăng xuất thất bại");
  }

  return await res.json();
}
//****************************
// GET PROFILE
//************************ */ */
export async function getProfile(token?: string) {
  const res = await fetch(`${API_PREFIX}/me`, {
    method: "GET",
    credentials: "include",
    headers: {
      ...authHeaders(token),
    },
  });
  const data = await res.json();
  if (!res.ok) return null;
  return data;
}

//****************************
// REFRESH ACCESS TOKEN
//************************ */ */
export async function refreshAccessToken() {
  const res = await fetch(`${API_PREFIX}/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Không thể làm mới token");
  }

  return await res.json();
}
