export const getApiBaseUrl = () => {
  if (typeof window === "undefined") {
    return process.env.INTERNAL_API_URL || "http://server:8000";
  }
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
};

export const API_BASE = getApiBaseUrl().replace(/\/$/, "");
export const API_ROOT = API_BASE.endsWith("/api")
  ? API_BASE
  : `${API_BASE}/api`;
