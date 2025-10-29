import { create } from "zustand";
import { createPhoto, deletePhoto, getPhotos, updatePhoto } from "@/lib/photo";
import { showToast } from "nextjs-toast-notify";

export interface Photo {
  id: number;
  title: string;
  slug: string;
  description?: string;
  image_url?: string;
  taken_at?:Date;
  location?:string;
  album_id?: string;
  user_id?: string;
  created_at?: Date;
}

interface PhotoState {
  photos: Photo[];
  formData: Partial<Photo>;
  editingPhoto: Photo | null;
  isModalOpen: boolean;
  fetchPhotos: () => Promise<void>;
  setFormData: (data: Partial<Photo>) => void;
  openAddModal: () => void;
  openEditModal: (album: Photo) => void;
  closeModal: () => void;
  addOrUpdatePhoto: () => Promise<void>;
  removePhoto: (id: number) => Promise<void>;
}

export const usePhotoStore = create<PhotoState>((set, get) => ({
  photos: [],
  formData: {},
  editingPhoto: null,
  isModalOpen: false,

  fetchPhotos: async () => {
    const res = await getPhotos();
    set({ photos: res.data });
  },

  setFormData: (data) =>
    set((state) => ({ formData: { ...state.formData, ...data } })),

  openAddModal: () =>
    set({ editingPhoto: null, isModalOpen: true, formData: {} }),
  openEditModal: (photo) =>
    set({ editingPhoto: photo, isModalOpen: true, formData: photo }),
  closeModal: () =>
    set({ isModalOpen: false, formData: {}, editingPhoto: null }),

  addOrUpdatePhoto: async () => {
    const { editingPhoto, formData } = get();

    // Tách riêng slug ra để không gửi trong request
    const { slug, ...payload } = formData;

    if (editingPhoto) {
      const res = await updatePhoto(editingPhoto.id, payload);
      showToast.success(res.message, {duration: 3000});
    } else {
      const res = await createPhoto(payload);
      showToast.success(res.message, {duration: 3000});

    }

    await get().fetchPhotos();
    get().closeModal();
  },

  removePhoto: async (id) => {
  try {
    const res = await deletePhoto(id);
    await get().fetchPhotos();
    showToast.success(res.message, {duration: 3000});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    showToast.error( "Xóa album thất bại", {duration: 3000} );
  }
},

}));
