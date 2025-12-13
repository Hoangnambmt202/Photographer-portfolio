import { cookies } from "next/headers";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

//****************************
// LOGIN ADMIN
//************************ */ */
export async function loginAdmin(email: string, password: string) {
  const cookieStore = await cookies()
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
    cookieStore.set({name:'access_token',value: data.data?.access_token, httpOnly:true, secure: true, sameSite: "none", path:"/"} )
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
 
  const res = await fetch(`${API_BASE}/auth/me`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
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
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Không thể làm mới token");
  }

  return await res.json();
}
