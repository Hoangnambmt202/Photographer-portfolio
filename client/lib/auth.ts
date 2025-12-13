
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
export function getAccessToken() {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )access_token=([^;]*)/);
  return match ? match[1] : null;
}
//****************************
// LOGIN ADMIN
//************************ */ */
export async function loginAdmin(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Đăng nhập thất bại");
  }
  if (data.data?.access_token) {
    document.cookie = `access_token=${data.data.access_token}; path=/; secure; samesite=none`;
  }

  return data;
}
//****************************
// LOGOUT ADMIN
//************************ */ */
export async function logoutAdmin() {
  const res = await fetch(`${API_BASE}/auth/logout`, {
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
export async function getProfile() {
  const token = getAccessToken();
  const res = await fetch(`${API_BASE}/auth/me`, {
    method: "GET",
    credentials: "include",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Không thể lấy thông tin người dùng");
  }
  return data;
}

//****************************
// REFRESH ACCESS TOKEN
//************************ */ */
export async function refreshAccessToken() {
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Không thể làm mới token");
  }

  return await res.json();
}
