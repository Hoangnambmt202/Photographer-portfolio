import { create } from "zustand";
import { createTag, getTags } from "@/lib/tag";

export interface Tag {
  id: number;
  value: string;
  slug: string;
}

interface TagState {
  tags: Tag[];
  fetchTags: () => Promise<void>;
  createTag: (name: string) => Promise<Tag>;
  isLoading: boolean;
}

export const useTagStore = create<TagState>((set) => ({
  tags: [],
  isLoading: false,

  fetchTags: async () => {
    try {
      set({ isLoading: true });
      const res = await getTags();
      set({ tags: res.data || res });
    } catch (error) {
      console.error("Failed to fetch tags:", error);
      set({ tags: [] });
    } finally {
      set({ isLoading: false });
    }
  },
  createTag: async (name: string) => {
    try {
      set({ isLoading: true });
      const res = await createTag({ name });
      if (res && res.data) {
        const newTag = res.data;
        set((state) => ({ tags: [...state.tags, newTag] }));
        
        return newTag;
      }
      return null;
    } catch (error) {
      console.error("Lỗi tạo tag:", error);
      throw error;
    }
    finally {
      set({ isLoading: false });
    }
  }
})
);
export{ createTag };

