import { create } from "zustand";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategoryApi,
} from "@/lib/category";
import { showToast } from "nextjs-toast-notify";

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
}

interface CategoryState {
  isLoading: boolean; 
  categories: Category[];
  formData: { name: string; slug: string; description: string };
  editingCategory: Category | null;
  deletingCategory: Category | null;
  isModalOpen: boolean;
  isDeleteModalOpen: boolean;
  setFormData: (data: Partial<{ name: string; slug: string; description: string }>) => void;
  openAddModal: () => void;
  openEditModal: (category: Category) => void;
  closeModal: () => void;
  openDeleteModal: (category: Category) => void;
  closeDeleteModal: () => void;
  fetchCategories: () => Promise<void>;
  addOrUpdateCategory: () => Promise<void>;
  deleteCategory: (id:number) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  isLoading: false,
  categories: [],
  formData: { name: "", slug: "", description: "" },
  editingCategory: null,
  deletingCategory: null,
  isModalOpen: false,
  isDeleteModalOpen: false,

  setFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),
  
  openAddModal: () =>
    set({
      editingCategory: null,
      formData: { name: "", slug: "", description: "" },
      isModalOpen: true,
    }),

  openEditModal: (category) =>
    set({
      editingCategory: category,
      formData: {
        name: category.name,
        slug: category.slug,
        description: category.description,
      },
      isModalOpen: true,
    }),

  closeModal: () =>
    set({
      isModalOpen: false,
      editingCategory: null,
      formData: { name: "", slug: "", description: "" },
    }),

  openDeleteModal: (category) =>
    set({ deletingCategory: category, isDeleteModalOpen: true }),

  closeDeleteModal: () =>
    set({ deletingCategory: null, isDeleteModalOpen: false }),

  // 🔹 Fetch categories từ API
  fetchCategories: async () => {
    try {
      set({ isLoading: true });
      const res = await getCategories();
      set({ categories: res.data });
      set({ isLoading: false });
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  // 🔹 Tạo hoặc cập nhật category qua API
  addOrUpdateCategory: async () => {
    const { editingCategory, formData } = get();
    const data = {
      name: formData.name.trim(),
      slug: formData.slug.trim() || formData.name.trim().toLowerCase().replace(/\s+/g, "-"),
      description: formData.description.trim(),
    };

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, data);
      } else {
        const res = await createCategory(data);
        showToast.success(res.message, {duration: 1500});
      }
      await get().fetchCategories();
      get().closeModal();
    } catch (error) {
      console.error("Lỗi khi lưu danh mục:", error);
    }
  },

  // 🔹 Xóa category qua API
  deleteCategory: async (id) => {
    try {
      const res = await deleteCategoryApi(id);
      showToast.success(res.message, {duration: 1500});
      await get().fetchCategories();
      get().closeDeleteModal();
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
    }
  },
}));
