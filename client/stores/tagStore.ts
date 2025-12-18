import { create } from "zustand";
import { getTags, createTag, updateTag, deleteTag } from "@/lib/tag";

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

type BaseResponse<T> = {
  status: string;
  message: string;
  data: T;
};

interface TagState {
  tags: Tag[];
  isLoading: boolean;

  modalOpen: boolean;
  modalMode: "add" | "edit";
  editingTag: Tag | null;

  fetchTags: () => Promise<void>;
  createTag: (name: string) => Promise<Tag>;
  updateTag: (id: number, name: string) => Promise<Tag>;
  deleteTag: (id: number) => Promise<void>;

  openAddModal: () => void;
  openEditModal: (tag: Tag) => void;
  closeModal: () => void;
}

export const useTagStore = create<TagState>((set, get) => ({
  tags: [],
  isLoading: false,

  modalOpen: false,
  modalMode: "add",
  editingTag: null,

  fetchTags: async () => {
    set({ isLoading: true });
    const res = await getTags();
    const data = (res as BaseResponse<Tag[]>).data ?? res;
    set({ tags: data, isLoading: false });
  },

  createTag: async (name) => {
    const res = await createTag({ name });
    const newTag = (res as BaseResponse<Tag>).data ?? res;
    await get().fetchTags();
    return newTag;
  },

  updateTag: async (id, name) => {
    const res = await updateTag(id, { name });
    const updated = (res as BaseResponse<Tag>).data ?? res;
    set((st) => ({
      tags: st.tags.map((t) => (t.id === id ? updated : t)),
    }));
    return updated;
  },

  deleteTag: async (id) => {
    await deleteTag(id);
    set((st) => ({
      tags: st.tags.filter((t) => t.id !== id),
    }));
  },

  openAddModal: () => set({ modalOpen: true, modalMode: "add", editingTag: null }),
  openEditModal: (tag) => set({ modalOpen: true, modalMode: "edit", editingTag: tag }),
  closeModal: () => set({ modalOpen: false }),
}));
