import { ServiceFormData, ServiceFilterParams } from "@/types/service.types";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
).replace(/\/$/, "");
const API_ROOT = API_BASE.endsWith("/api") ? API_BASE : `${API_BASE}/api`;
const SERVICE_API = `${API_ROOT}/services`;

const getStoredAccessToken = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("auth-storage");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return (
      parsed?.state?.accessToken || parsed?.state?.state?.accessToken || null
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

// GET ALL SERVICES với filter
export async function getServices(params?: ServiceFilterParams) {
  const query = new URLSearchParams();
  
  if (params?.search) query.append("search", params.search);
  if (params?.status) query.append("status", params.status);
  if (params?.category_id) query.append("category_id", String(params.category_id));
  if (params?.tag_id) query.append("tag_id", String(params.tag_id));
  if (params?.min_price) query.append("min_price", String(params.min_price));
  if (params?.max_price) query.append("max_price", String(params.max_price));
  if (params?.featured !== undefined) query.append("featured", String(params.featured));
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));
  
  const res = await fetch(`${SERVICE_API}?${query.toString()}`, {
    method: "GET",
    credentials: "include",
    headers: authHeaders(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API Error (${res.status}): ${errorText}`);
  }
  
  const response = await res.json();
  
  // Chuyển đổi data để tương thích với frontend
  if (response.data && Array.isArray(response.data.data)) {
    return {
      ...response,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: response.data.data.map((service: any) => ({
        ...service,
        // Giữ tương thích với component cũ
        isActive: service.status === "active",
        category: service.category?.name || "",
        maxPeople: service.max_people || 0,
        includedItems: service.included_items ? service.included_items.split(',').map((item: string) => item.trim()) : [],
        // Thêm các trường mặc định nếu không có
        rating: service.rating || 5,
        totalBookings: service.total_bookings || 0,
      }))
    };
  }
  
  return response;
}

// CREATE SERVICE
export async function createService(payload: ServiceFormData) {
  // Chuẩn bị data cho API
  const apiData = {
    name: payload.name,
    description: payload.description,
    price: parseInt(payload.price.replace(/\D/g, "")) || 0,
    duration: payload.duration,
    max_people: parseInt(payload.max_people) || null,
    included_items: payload.included_items,
    status: payload.status || "active",
    category_id: payload.category_id,
    cover_image: payload.cover_image || null,
    discount_percent: payload.discount_percent || 0,
    is_featured: payload.is_featured || false,
    display_order: payload.display_order || 0,
    tag_ids: payload.tag_ids || []
  };

  const res = await fetch(SERVICE_API, {
    method: "POST",
    credentials: "include",
    headers: authHeaders(),
    body: JSON.stringify(apiData)
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API Error (${res.status}): ${errorText}`);
  }
  
  const response = await res.json();
  
  // Chuyển đổi để tương thích
  if (response.data) {
    const service = response.data;
    return {
      ...service,
      isActive: service.status === "active",
      category: service.category?.name || "",
      maxPeople: service.max_people || 0,
      includedItems: service.included_items ? service.included_items.split(',').map((item: string) => item.trim()) : [],
      rating: 5,
      totalBookings: 0,
    };
  }
  
  return response;
}

// UPDATE SERVICE
export async function updateService(id: number, payload: ServiceFormData) {
  // Chuẩn bị data cho API
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiData: any = {};
  
  if (payload.name !== undefined) apiData.name = payload.name;
  if (payload.description !== undefined) apiData.description = payload.description;
  if (payload.price !== undefined) apiData.price = parseInt(payload.price.replace(/\D/g, "")) || 0;
  if (payload.duration !== undefined) apiData.duration = payload.duration;
  if (payload.max_people !== undefined) apiData.max_people = parseInt(payload.max_people) || null;
  if (payload.included_items !== undefined) apiData.included_items = payload.included_items;
  if (payload.status !== undefined) apiData.status = payload.status;
  if (payload.category_id !== undefined) apiData.category_id = payload.category_id;
  if (payload.cover_image !== undefined) apiData.cover_image = payload.cover_image;
  if (payload.discount_percent !== undefined) apiData.discount_percent = payload.discount_percent;
  if (payload.is_featured !== undefined) apiData.is_featured = payload.is_featured;
  if (payload.display_order !== undefined) apiData.display_order = payload.display_order;
  if (payload.tag_ids !== undefined) apiData.tag_ids = payload.tag_ids;

  const res = await fetch(`${SERVICE_API}/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: authHeaders(),
    body: JSON.stringify(apiData)
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API Error (${res.status}): ${errorText}`);
  }
  
  const response = await res.json();
  
  // Chuyển đổi để tương thích
  if (response.data) {
    const service = response.data;
    return {
      ...service,
      isActive: service.status === "active",
      category: service.category?.name || "",
      maxPeople: service.max_people || 0,
      includedItems: service.included_items ? service.included_items.split(',').map((item: string) => item.trim()) : [],
    };
  }
  
  return response;
}

// UPDATE SERVICE STATUS
export async function updateServiceStatus(id: number, status: "active" | "inactive" | "draft") {
  const res = await fetch(`${SERVICE_API}/${id}/status`, {
    method: "PATCH",
    credentials: "include",
    headers: authHeaders(),
    body: JSON.stringify({ status })
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API Error (${res.status}): ${errorText}`);
  }
  
  return res.json();
}

// DELETE SERVICE
export async function deleteService(id: number) {
  const res = await fetch(`${SERVICE_API}/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: authHeaders(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API Error (${res.status}): ${errorText}`);
  }
  
  return res.json();
}

// UPLOAD SERVICE COVER IMAGE
export async function uploadServiceCover(id: number, file: File) {
  const formData = new FormData();
  formData.append("cover_image", file);

  const res = await fetch(`${SERVICE_API}/${id}/upload-cover`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Authorization": `Bearer ${getStoredAccessToken()}`,
    },
    body: formData
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API Error (${res.status}): ${errorText}`);
  }
  
  return res.json();
}