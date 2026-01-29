export const getApiBaseUrl = () => {
  // Server-side (SSR, RSC, Route Handler)
  if (typeof window === "undefined") {
    if (!process.env.INTERNAL_API_URL) {
      throw new Error("❌ INTERNAL_API_URL is not defined");
    }
    return process.env.INTERNAL_API_URL;
  }

  // Client-side (Browser)
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error("❌ NEXT_PUBLIC_API_URL is not defined");
  }
  return process.env.NEXT_PUBLIC_API_URL;
};

export const API_BASE = getApiBaseUrl().replace(/\/$/, "");
export const API_ROOT = API_BASE.endsWith("/api")
  ? API_BASE
  : `${API_BASE}/api`;
