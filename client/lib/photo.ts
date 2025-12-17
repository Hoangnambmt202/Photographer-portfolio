/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_PREFIX = `${API_BASE}/photos`;

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

  const res = await fetch(`${API_PREFIX}/?${params.toString()}`, {
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

  // File
  if (data.image_url instanceof File) {
    form.append("image_url", data.image_url); // ✔ backend yêu cầu image_url
  }

  const res = await fetch(`${API_PREFIX}`, {
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
  const res = await fetch(`${API_PREFIX}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Không thể cập nhật photo");
  return await res.json();
}

export async function deletePhoto(id: number) {
  const res = await fetch(`${API_PREFIX}/${id}`, {
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
  const res = await fetch(`${API_PREFIX}/albums/${albumId}/photos`, {
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
  const res = await fetch(`${API_PREFIX}/albums/${albumId}/reorder-photos`, {
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
  const res = await fetch(`${API_PREFIX}/${photoId}/set-featured`, {
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
