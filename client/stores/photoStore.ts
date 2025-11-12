import { create } from "zustand";
import { createPhoto, deletePhoto, getPhotos, updatePhoto } from "@/lib/photo";
import { showToast } from "nextjs-toast-notify";

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
  created_at?: Date | null;
  status: string;
}

interface PhotoState {
  photos: Photo[];
  formData: Partial<Photo>;
  editingPhoto: Photo | null;
  isModalOpen: boolean;
  isUploading: boolean;
  uploadedPhotoId: number | null;

  // Phân trang backend
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;

  fetchPhotos: (page?: number) => Promise<void>;
  setFormData: (data: Partial<Photo>) => void;
  openAddModal: () => void;
  openEditModal: (album: Photo) => void;
  closeModal: () => void;
  addOrUpdatePhoto: () => Promise<void>;
  removePhoto: (id: number) => Promise<void>;
  startUploadAnimation: (id: number) => void;
  setPage: (page: number) => void;
}

export const usePhotoStore = create<PhotoState>((set, get) => ({
  photos: [],
  formData: {},
  editingPhoto: null,
  isModalOpen: false,
  isUploading: false,
  uploadedPhotoId: null,

  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 10,
  totalItems: 0,

  // Lấy danh sách ảnh theo trang
  fetchPhotos: async (page = 1) => {
    try {
      const { itemsPerPage } = get();
      const res = await getPhotos(page, itemsPerPage); // API cần hỗ trợ params page + limit
      set({
        photos: res.data,
        currentPage: res.page,
        totalPages: res.total_pages,
        totalItems: res.total,
        itemsPerPage: res.limit,
      });
    } catch (error) {
      console.error(error);
      showToast.error("Không thể tải danh sách ảnh", { duration: 3000 });
    }
  },

  setFormData: (data) =>
    set((state) => ({ formData: { ...state.formData, ...data } })),

  openAddModal: () =>
    set({ editingPhoto: null, isModalOpen: true, formData: {} }),

  openEditModal: (photo) =>
    set({ editingPhoto: photo, isModalOpen: true, formData: photo }),
  closeModal: () =>
    set({ isModalOpen: false, formData: {}, editingPhoto: null }),

  addOrUpdatePhoto: async (payload) => {
    const { editingPhoto, currentPage } = get();
    try {
      let res;
      if (editingPhoto) {
        res = await updatePhoto(editingPhoto.id, payload);
        showToast.success(res.message || "Cập nhật ảnh thành công", {
          duration: 3000,
        });
      } else {
        res = await createPhoto(payload);
        showToast.success(res.message || "Thêm ảnh thành công", {
          duration: 3000,
        });
      }
      await get().fetchPhotos(currentPage); // refresh trang hiện tại
      get().closeModal();
    } catch (error) {
      console.error(error);
      showToast.error("Lưu ảnh thất bại", { duration: 3000 });
    }
  },

  removePhoto: async (id) => {
    const { currentPage } = get();
    try {
      const res = await deletePhoto(id);
      await get().fetchPhotos(currentPage); // refresh trang hiện tại
      showToast.success(res.message || "Đã xóa ảnh", { duration: 3000 });
    } catch (error) {
      console.error(error);
      showToast.error("Xóa ảnh thất bại", { duration: 3000 });
    }
  },

  startUploadAnimation: (id: number) => {
    set({ isUploading: true, uploadedPhotoId: id });
    setTimeout(() => set({ isUploading: false, uploadedPhotoId: null }), 6000);
  },

  // Cập nhật trang hiện tại
  setPage: (page: number) => set({ currentPage: page }),
}));
