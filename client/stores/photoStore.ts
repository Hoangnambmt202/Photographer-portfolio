import { create } from "zustand";
import { createPhoto, deletePhoto, getPhotos, updatePhoto } from "@/lib/photo";
import { showToast } from "nextjs-toast-notify";

import { Photo, PhotoBaseState, PhotoFormData } from "@/types";

interface PhotoState extends PhotoBaseState {

  fetchPhotos: (page?: number) => Promise<void>;
  setFormData: (data: PhotoFormData) => void;
  openAddModal: () => void;
  openEditModal: (album: Photo) => void;
  closeModal: () => void;
  addOrUpdatePhoto: () => Promise<void>;
  removePhoto: (id: number) => Promise<void>;
  setPage: (page: number) => void;
}

export const usePhotoStore = create<PhotoState>((set, get) => ({
  photos: [],
  formData: {} as PhotoFormData,
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
    set({ editingPhoto: null, isModalOpen: true, formData: {} as PhotoFormData }),

  openEditModal: (photo) =>
    set({ editingPhoto: photo, isModalOpen: true, formData: photo as PhotoFormData }),
  closeModal: () =>
    set({ isModalOpen: false, formData: {} as PhotoFormData, editingPhoto: null }),

  addOrUpdatePhoto: async () => {
    const { editingPhoto, currentPage, formData } = get();
    try {
      let res;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { slug, ...payload } = formData;
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

  // Cập nhật trang hiện tại
  setPage: (page: number) => set({ currentPage: page }),
}));
