
export type PhotoStatus = "public" | "private" | "draft" | "archived";

export interface AlbumSimple {
  id: number;
  title: string;
}

export interface Photo {
  id: number;
  title: string;
  slug: string;
  description?: string | null;
  image_url?: string;
  taken_at?: Date | null;
  location?: string;
  album?: AlbumSimple | null;
  user_id?: number | null;
  order?: number;
  created_at?: Date | null;
  status: PhotoStatus;
}

// Kiểu dữ liệu cho Form Data (có thể chứa File khi upload)
export interface PhotoFormData extends Omit<Partial<Photo>, 'image_url'> {
    // cover_image có thể là File khi upload, hoặc string URL khi ở chế độ edit
    image_url?: string | File | File[];
}
/* ===== Search / Filter ===== */
export interface PhotoFilters {
  search?: string;          // title / description
  album_id?: number;
  tag_ids?: number[];
  status?: PhotoStatus;
  taken_from?: string;      // YYYY-MM-DD
  taken_to?: string;
}
/* ===== Pagination response ===== */
export interface PaginatedPhotos {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  data: Photo[];
}

export interface PhotoBaseState {
  photos: Photo[];

  // Pagination
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;

  // Search / filter
  filters: PhotoFilters;

  // UI
  isLoading: boolean;
  isModalOpen: boolean;
  editingPhoto: Photo | null;
  formData: PhotoFormData;
}