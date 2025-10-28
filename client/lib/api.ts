export async function apiFetch(
  path: string,
  options: RequestInit = {}
) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${baseUrl}${path}`, {
    credentials: "include", // ⚡ cho phép gửi cookie JWT từ FastAPI
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  // Tự động parse JSON hoặc ném lỗi
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.detail || "Lỗi kết nối server");
  }
  return data;
}
