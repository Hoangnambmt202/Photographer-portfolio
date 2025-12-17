// client/types/photo.ts

export interface Photo {
  id: number;
  title: string;
  slug: string;
  description?: string;
  image_url?: string;
  taken_at?: Date | null;
  location?: string;
  album_id?: number | null;
  user_id?: number | null;
  order?: number;
  created_at?: Date | null;
  status: string;
}

// Kiểu dữ liệu cho Form Data (có thể chứa File khi upload)
export interface PhotoFormData extends Omit<Partial<Photo>, 'image_url'> {
    // cover_image có thể là File khi upload, hoặc string URL khi ở chế độ edit
    image_url?: string | File | File[];
}

// Các trạng thái cơ bản (không bao gồm các hàm)
export interface PhotoBaseState {
  photos: Photo[];
  formData: PhotoFormData;
  editingPhoto: Photo | null;
  isModalOpen: boolean;
  isUploading: boolean;
  uploadedPhotoId: number | null;

  // Phân trang backend
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
}