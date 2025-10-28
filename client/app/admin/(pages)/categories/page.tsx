"use client";
import CategoryForm from "@/components/admin/features/category/CategoryForm";
import DeleteModal from "@/components/admin/DeleteModal";
import { useCategoryStore } from "@/stores/categoryStore";
import { Edit2, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/common/button";

export default function CategoriesPage() {
  const {
    categories,
    fetchCategories,
    openAddModal,
    openEditModal,
    openDeleteModal,
    isModalOpen,
    closeModal,
    deleteCategory,
  } = useCategoryStore();
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const handleDelete = () => {
    if (deleteId !== null) {
      deleteCategory(deleteId);
      setDeleteId(null);
    }
  };
  if (categories.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Danh mục</h1>
          <button
            onClick={openAddModal}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" />
            <span>Thêm Danh mục mới</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tên danh mục
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Chi tiết
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 font-medium">-</td>
                <td className="px-6 py-4 text-gray-600">-</td>
                <td className="px-6 py-4">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Danh mục</h1>

        <Button
          className="group flex items-center space-x-2 px-4 py-2 gap-1 cursor-pointer outline-none bg-green-500 hover:bg-green-700 rounded-lg"
          title="Add New"
          onClick={openAddModal}
        >
          <svg
            className="stroke-white fill-none transition-transform duration-300 
                       group-hover:rotate-90 
                       group-active:duration-0"
            viewBox="0 0 24 24"
            height="20px"
            width="20px"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeWidth="1.5"
              d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
            ></path>
            <path strokeWidth="1.5" d="M8 12H16"></path>
            <path strokeWidth="1.5" d="M12 16V8"></path>
          </svg>
          <span className="text-white">Thêm mới</span>
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tên danh mục
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Chi tiết
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{category.name}</td>
                <td className="px-6 py-4 text-gray-600">{category.slug}</td>
                <td className="px-6 py-4">{category.description}</td>
                <td className="px-6 py-4 text-right space-x-4">
                  <button
                    onClick={() => openEditModal(category)}
                    className="text-blue-600 hover:text-blue-700 transition"
                  >
                    <Edit2 className="w-4 h-4 inline" />
                  </button>
                  <button
                    onClick={() => setDeleteId(category.id)}
                    className="text-red-600 hover:text-red-700 transition"
                  >
                    <Trash2 className="w-4 h-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Danh mục</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <CategoryForm />
          </div>
        </div>
      )}

      <DeleteModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        item="danh mục"
        itemName={categories.find((cat) => cat.id === deleteId)?.name}
      />
    </div>
  );
}
