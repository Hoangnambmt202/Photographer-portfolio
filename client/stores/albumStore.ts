import { create } from "zustand";
import { getAlbums, createAlbum, updateAlbum, deleteAlbum } from "@/lib/album";
import { showToast } from "nextjs-toast-notify";
import { Album, AlbumBaseState, AlbumFormData } from "@/types";

interface AlbumState extends AlbumBaseState {
  fetchAlbums: () => Promise<void>;
  setFormData: (data: AlbumFormData) => void;
  openAddModal: () => void;
  openEditModal: (album: Album) => void;
  closeModal: () => void;
  addOrUpdateAlbum: () => Promise<Album>;
  removeAlbum: (id: number) => Promise<void>;
}

export const useAlbumStore = create<AlbumState>((set, get) => ({
  albums: [],
  formData: {} as AlbumFormData,
  editingAlbum: null,
  isModalOpen: false,
  modalMode: "add",

  fetchAlbums: async () => {
    const res = await getAlbums();
    set({ albums: res.data });
  },

  setFormData: (data) =>
    set((state) => ({ formData: { ...state.formData, ...data } })),

  openAddModal: () =>
    set({
      editingAlbum: null,
      modalMode: "add",
      isModalOpen: true,
      formData: {} as AlbumFormData,
    }),
  openEditModal: (album) =>
    set({
      editingAlbum: album,
      modalMode: "edit",
      isModalOpen: true,
      formData: {
        title: album.title,
        slug: album.slug,
        description: album.description || "",
        category: album.category?.id ?? null,
        status: album.status,
        tags:
          album.tags?.map((t) => ({
            id: t.id,
            value: t.name,
          })) ?? [],
        cover_image: undefined, // Không gán URL vào FormFile
      },
    }),

  closeModal: () =>
    set({
      isModalOpen: false,
      formData: {} as AlbumFormData,
      editingAlbum: null,
    }),

  addOrUpdateAlbum: async () => {
    const { editingAlbum, formData } = get();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { slug, ...payload } = formData;

    let res;

    if (editingAlbum) {
        const payloadUpdate = {
    ...payload,
    tags: formData.tags?.map(t => t.id) ?? [],   // 👈 ONLY ID LIST
  };
      console.log("payload nhận được trc gửi", payloadUpdate);
      res = await updateAlbum(editingAlbum.id, payloadUpdate);
    } else {
      res = await createAlbum(payload);
    }

    showToast.success(res.message, { duration: 3000 });
    await get().fetchAlbums();
    get().closeModal();

    return res.data; // 👈 đảm bảo luôn return
  },

  removeAlbum: async (id) => {
    try {
      const res = await deleteAlbum(id);
      await get().fetchAlbums();
      showToast.success(res.message, { duration: 3000 });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      showToast.error("Xóa album thất bại", { duration: 3000 });
    }
  },
}));
