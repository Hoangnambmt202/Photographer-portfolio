/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(
  /\/$/,
  ""
);
const API_ROOT = API_BASE.endsWith("/api") ? API_BASE : `${API_BASE}/api`;
const PHOTOS_API = `${API_ROOT}/photos`;

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

// ✅ Lấy danh sách ảnh
export async function getPhotos(
  page: number = 1,
  limit: number = 10,
  search?: string
) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (search) params.append("search", search);

  const res = await fetch(`${PHOTOS_API}/?${params.toString()}`, {
    method: "GET",
    credentials: "include",
    headers: {
      ...authHeaders(),
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Không thể tải danh sách ảnh: ${err}`);
  }

  // trả về { total, page, limit, total_pages, data }
  return await res.json(); 
}


// ✅ Tạo ảnh (FormData hoặc JSON)
export async function createPhoto(data: any) {
  const form = new FormData();

  if (data.title) form.append("title", data.title);
  if (data.description) form.append("description", data.description);
  if (data.status) form.append("status", data.status);
  if (data.album_id) form.append("album_id", String(data.album_id));
  if (data.taken_at) form.append("taken_at", data.taken_at);
  if (data.location) form.append("location", data.location);

  // File
  if (data.image_url instanceof File) {
    form.append("image_url", data.image_url); // ✔ backend yêu cầu image_url
  }

  const res = await fetch(`${PHOTOS_API}/`, {
    method: "POST",
    body: form,
    credentials: "include",
    headers: {
      ...authHeaders(),
    },
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

// ✅ Upload nhiều ảnh cùng lúc (server: POST /api/photos/bulk)
export type CreatePhotosBulkMeta = {
  description?: string;
  status?: string;
  album_id?: number | null;
  taken_at?: string | Date | null;
  location?: string;
};

export async function createPhotosBulk(files: File[], data: CreatePhotosBulkMeta) {
  const form = new FormData();
  for (const f of files) form.append("images", f);

  if (data.description) form.append("description", data.description);
  if (data.status) form.append("status", data.status);
  if (data.album_id != null) form.append("album_id", String(data.album_id));
  if (data.taken_at) {
    if (data.taken_at instanceof Date) {
      // python datetime.fromisoformat không parse 'Z' -> bỏ timezone suffix
      form.append("taken_at", data.taken_at.toISOString().slice(0, 19));
    } else {
      form.append("taken_at", data.taken_at);
    }
  }
  if (data.location) form.append("location", data.location);

  const res = await fetch(`${PHOTOS_API}/bulk`, {
    method: "POST",
    body: form,
    credentials: "include",
    headers: {
      ...authHeaders(),
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}


export async function updatePhoto(id: number, data: any) {
  const res = await fetch(`${PHOTOS_API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Không thể cập nhật photo");
  return await res.json();
}

export async function deletePhoto(id: number) {
  const res = await fetch(`${PHOTOS_API}/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      ...authHeaders(),
    },
  });
  if (!res.ok) throw new Error("Không thể xóa photo");
  return await res.json();
}


// ✅ Lấy tất cả ảnh trong album
export async function getAlbumPhotos(albumId: number) {
  const res = await fetch(`${API_ROOT}/albums/${albumId}/photos`, {
    credentials: "include",
    method: "GET",
    headers: {
      ...authHeaders(),
    },
  });
  
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Không thể tải danh sách ảnh trong album: ${err}`);
  }
  
  // trả về { status, message, data: Photo[] }
  return await res.json(); 
}


// ✅ Reorder ảnh trong album (drag-drop)
export async function reorderAlbumPhotos(
  albumId: number,
  photos: Array<{ id: number; order: number }>
) {
  const res = await fetch(`${API_ROOT}/albums/${albumId}/reorder-photos`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    credentials: "include",
    body: JSON.stringify({ photos }),
  });
  
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Không thể reorder ảnh: ${err}`);
  }
  
  // trả về { status, message, data: Photo[] }
  return await res.json(); 
}


// ✅ Set featured photo cho album
export async function setFeaturedPhoto(photoId: number, albumId: number) {
  // server đang khai báo endpoint này trong router albums: PATCH /api/albums/{photo_id}/set-featured
  const res = await fetch(`${API_ROOT}/albums/${photoId}/set-featured`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    credentials: "include",
    body: JSON.stringify({ album_id: albumId }),
  });
  
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Không thể set ảnh nổi bật: ${err}`);
  }
  // trả về { status, message, data: Photo }
  return await res.json(); 
}
