import { create } from "zustand";
import { createPhoto, createPhotosBulk, deletePhoto, getPhotos, updatePhoto, getAlbumPhotos, reorderAlbumPhotos, setFeaturedPhoto } from "@/lib/photo";
import { showToast } from "nextjs-toast-notify";

import { Photo, PhotoBaseState, PhotoFilters, PhotoFormData } from "@/types";

interface PhotoState extends PhotoBaseState {
  fetchPhotos: (page?: number, filters?: PhotoFilters) => Promise<void>;
  setFormData: (data: PhotoFormData) => void;
  openAddModal: () => void;
  openEditModal: (album: Photo) => void;
  closeModal: () => void;
  addOrUpdatePhoto: () => Promise<void>;
  removePhoto: (id: number) => Promise<void>;
  setPage: (page: number) => void;
  isLoading: boolean;
  isSearching: boolean;
  albumPhotos: Photo[];
  fetchAlbumPhotos: (albumId: number) => Promise<void>;
  reorderPhotos: (albumId: number, photos: Array<{ id: number; order: number }>) => Promise<void>;
  setFeatured: (photoId: number, albumId: number) => Promise<void>;
}

export const usePhotoStore = create<PhotoState>((set, get) => ({
  photos: [],
  filters: {},
  formData: {} as PhotoFormData,
  editingPhoto: null,
  isModalOpen: false,
  isUploading: false,
  uploadedPhotoId: null,

  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 10,
  totalItems: 0,
  isLoading: false,
  isSearching: false,
  // Album photos
  albumPhotos: [],
  
  // Lấy danh sách ảnh theo trang
  fetchPhotos: async (page = 1, filters?: PhotoFilters) => {
    set({ isLoading: true });
    try {
      const res = await getPhotos({
        page,
        limit: get().itemsPerPage,
        filters,
      });
      set({
        photos: res.data,
        currentPage: res.page,
        totalPages: res.total_pages,
        totalItems: res.total,
      });
    } finally {
      set({ isLoading: false });
    }
  },
  
  /* ================= FILTER ================= */
  setFilters: (filters: PhotoFilters | undefined) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
      currentPage: 1, // reset page khi search
    })),

  clearFilters: () =>
    set({
      filters: {},
      currentPage: 1,
    }),

  setPage: (page) => set({ currentPage: page }),

/* ================= CRUD ================= */
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
          duration: 1500,
        });
      } else {
        // Multi upload: image_url = File[]
        if (Array.isArray(payload.image_url)) {
          const files = payload.image_url;
          // Bỏ title/slug/image_url vì server bulk lấy title từ filename, image_url là files đã tách riêng
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { title: _title, image_url: _imageUrl, ...rest } = payload;
          res = await createPhotosBulk(files, rest);
          showToast.success(res.message || `Tải lên thành công ${files.length} ảnh`, {
            duration: 3000,
          });
        } else {
          res = await createPhoto(payload);
          showToast.success(res.message || "Thêm ảnh thành công", {
            duration: 3000,
          });
        }
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
      await get().fetchPhotos(currentPage); 
      showToast.success(res.message || "Đã xóa ảnh", { duration: 3000 });
    } catch (error) {
      console.error(error);
      showToast.error("Xóa ảnh thất bại", { duration: 3000 });
    }
  },
  // ✅ Fetch album photos
  fetchAlbumPhotos: async (albumId: number) => {
    try {
      set({ isLoading: true });
      const res = await getAlbumPhotos(albumId);
      set({ albumPhotos: res.data });
    } catch (error) {
      console.error(error);
      showToast.error("Không thể tải ảnh trong album", { duration: 3000 });
    } finally {
      set({ isLoading: false });
    }
  },

  // ✅ Reorder photos in album
  reorderPhotos: async (albumId: number, photos: Array<{ id: number; order: number }>) => {
    try {
      const res = await reorderAlbumPhotos(albumId, photos);
      set({ albumPhotos: res.data });
      showToast.success("Sắp xếp ảnh thành công", { duration: 3000 });
    } catch (error) {
      console.error(error);
      showToast.error("Sắp xếp ảnh thất bại", { duration: 3000 });
    }
  },

  // ✅ Set featured photo
  setFeatured: async (photoId: number, albumId: number) => {
    try {
      await setFeaturedPhoto(photoId, albumId);
      // Update albumPhotos if it's loaded
      const { albumPhotos } = get();
      if (albumPhotos.length > 0) {
        await get().fetchAlbumPhotos(albumId); // Refresh
      }
      showToast.success("Đặt ảnh nổi bật thành công", { duration: 3000 });
    } catch (error) {
      console.error(error);
      showToast.error("Đặt ảnh nổi bật thất bại", { duration: 3000 });
    }
  },
}));
