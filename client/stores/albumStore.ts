import { create } from "zustand";
import { getAlbums, createAlbum, updateAlbum, deleteAlbum } from "@/lib/album";
import { showToast } from "nextjs-toast-notify";
import { Album, AlbumBaseState, AlbumFilters, AlbumFormData } from "@/types";

interface AlbumState extends AlbumBaseState {
  filters: AlbumFilters;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  isLoading: boolean;
  isSearching: boolean;

  fetchAlbums: (page?: number, filters?: AlbumFilters) => Promise<void>;
  setFilters: (filters?: AlbumFilters) => void;
  clearFilters: () => void;
  setPage: (page: number) => void;

  setFormData: (data: AlbumFormData) => void;
  openAddModal: () => void;
  openEditModal: (album: Album) => void;
  closeModal: () => void;

  addOrUpdateAlbum: () => Promise<Album>;
  removeAlbum: (id: number) => Promise<void>;
}

export const useAlbumStore = create<AlbumState>((set, get) => ({
  /* ================= BASE ================= */
  albums: [],
  filters: {},

  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 10,
  totalItems: 0,
  isLoading: false,
  isSearching: false,

  formData: {} as AlbumFormData,
  editingAlbum: null,
  isModalOpen: false,
  modalMode: "add",

  /* ================= FETCH ================= */
  fetchAlbums: async (page = 1, filters?: AlbumFilters) => {
    const appliedFilters = filters ?? get().filters;
    
    set({ isLoading: true, isSearching: Boolean(appliedFilters?.search) });
    
    try {
      const res = await getAlbums({
        page,
        limit: get().itemsPerPage,
        filters: appliedFilters,
      });
      console.log(res)

      set({
        albums: res.data.data,
        currentPage: res.data.page,
        totalPages: res.data.total_pages,
        totalItems: res.data.total,
        filters: appliedFilters,
      });
    } finally {
      set({ isLoading: false, isSearching:false });
    }
  },

  /* ================= FILTER ================= */
  setFilters: (next) =>
    set((state) => {
      const merged = { ...state.filters, ...(next ?? {}) };

      if (JSON.stringify(merged) === JSON.stringify(state.filters)) {
        return state; // ⛔ không update nếu giống nhau
      }

      return {
        filters: merged,
        currentPage: 1,
      };
    }),

  clearFilters: () =>
    set({
      filters: {},
      currentPage: 1,
    }),

  setPage: (page) => set({ currentPage: page }),

  /* ================= FORM ================= */
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
        cover_image: undefined,
      },
    }),

  closeModal: () =>
    set({
      isModalOpen: false,
      formData: {} as AlbumFormData,
      editingAlbum: null,
    }),

  /* ================= CRUD ================= */
  addOrUpdateAlbum: async () => {
    const { editingAlbum, formData, currentPage } = get();
    const { slug, ...payload } = formData;

    let res;

    if (editingAlbum) {
      res = await updateAlbum(editingAlbum.id, {
        ...payload,
        tags: formData.tags?.map((t) => t.id) ?? [],
      });
    } else {
      res = await createAlbum(payload);
    }

    showToast.success(res.message, { duration: 3000 });
    await get().fetchAlbums(currentPage);
    get().closeModal();

    return res.data;
  },

  removeAlbum: async (id) => {
    try {
      const res = await deleteAlbum(id);
      await get().fetchAlbums(get().currentPage);
      showToast.success(res.message, { duration: 3000 });
    } catch (error) {
      console.error(error);
      showToast.error("Xóa album thất bại", { duration: 3000 });
    }
  },
}));
