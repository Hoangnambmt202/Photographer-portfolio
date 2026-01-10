"use client";
import CategoryForm from "@/components/admin/features/category/CategoryForm";
import DeleteModal from "@/components/admin/DeleteModal";
import { useCategoryStore } from "@/stores/categoryStore";
import { Edit2, Plus, Trash2, X, Search } from "lucide-react"; // Thêm icon Search
import { useEffect, useState } from "react";
import { Button } from "@/components/common/Button";
import LoaderBlock from "@/components/common/LoaderBlock";

export default function CategoriesPage() {
  const {
    categories,
    fetchCategories,
    openAddModal,
    openEditModal,
    isModalOpen,
    isLoading,
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

  if (isLoading) {
    return <LoaderBlock label="Đang tải danh mục..." />;
  }

  // Giao diện chung cho cả khi có data và empty (đã merge logic hiển thị)
  return (
    <>
      <div className="space-y-6 pb-20 md:pb-0">
        {/* Header Section - Responsive Stack */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Danh mục</h1>
            <p className="text-sm text-gray-500 mt-1">Quản lý phân loại nội dung</p>
          </div>

          <Button
            className="group w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-sm"
            title="Add New"
            onClick={openAddModal}
          >
            <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
            <span className="font-medium">Thêm danh mục</span>
          </Button>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            
            {/* Table Container - Enable Horizontal Scroll on Mobile */}
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200">
              <table className="w-full min-w-[600px]"> 
                <thead className="bg-gray-50/50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Tên danh mục
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Mô tả
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                         <div className="flex flex-col items-center justify-center">
                            <Search className="w-12 h-12 text-gray-300 mb-3" />
                            <p>Chưa có danh mục nào</p>
                         </div>
                      </td>
                    </tr>
                  ) : (
                    categories.map((category) => (
                      <tr key={category.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-medium text-gray-900">{category.name}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                            <code className="bg-gray-100 px-2 py-1 rounded text-xs">{category.slug}</code>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {category.description || <span className="text-gray-300 italic">Không có mô tả</span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => openEditModal(category)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Chỉnh sửa"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteId(category.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Xóa"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
        </div>

        {/* Modal - Responsive Sizing */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 shrink-0">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    Thông tin danh mục
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Form Container with Scroll */}
              <div className="overflow-y-auto p-0">
                <CategoryForm />
              </div>
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
    </>
  );
}