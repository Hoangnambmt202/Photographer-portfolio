import { create } from "zustand";
import { getAlbums, createAlbum, updateAlbum, deleteAlbum } from "@/lib/album";
import { showToast } from "nextjs-toast-notify";

export interface Album {
  id: number;
  title: string;
  slug: string;
  description?: string;
  cover?: string;
  status?: string;
  category_id?: number;
  created_at?: Date;
}

interface AlbumState {
  albums: Album[];
  formData: Partial<Album>;
  editingAlbum: Album | null;
  isModalOpen: boolean;
  fetchAlbums: () => Promise<void>;
  setFormData: (data: Partial<Album>) => void;
  openAddModal: () => void;
  openEditModal: (album: Album) => void;
  closeModal: () => void;
  addOrUpdateAlbum: () => Promise<void>;
  removeAlbum: (id: number) => Promise<void>;
}

export const useAlbumStore = create<AlbumState>((set, get) => ({
  albums: [],
  formData: {},
  editingAlbum: null,
  isModalOpen: false,

  fetchAlbums: async () => {
    const res = await getAlbums();
    set({ albums: res.data });
  },

  setFormData: (data) =>
    set((state) => ({ formData: { ...state.formData, ...data } })),

  openAddModal: () =>
    set({ editingAlbum: null, isModalOpen: true, formData: {} }),
  openEditModal: (album) =>
    set({ editingAlbum: album, isModalOpen: true, formData: album }),
  closeModal: () =>
    set({ isModalOpen: false, formData: {}, editingAlbum: null }),

  addOrUpdateAlbum: async () => {
    const { editingAlbum, formData } = get();

    // Tách riêng slug ra để không gửi trong request
    const { slug, ...payload } = formData;

    if (editingAlbum) {
      const res = await updateAlbum(editingAlbum.id, payload);
      showToast.success(res.message, {duration: 3000});
    } else {
      const res = await createAlbum(payload);
      showToast.success(res.message, {duration: 3000});

    }

    await get().fetchAlbums();
    get().closeModal();
  },

  removeAlbum: async (id) => {
  try {
    const res = await deleteAlbum(id);
    await get().fetchAlbums();
    showToast.success(res.message, {duration: 3000});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    showToast.error( "Xóa album thất bại", {duration: 3000} );
  }
},

}));
