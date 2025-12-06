"use client";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

import DeleteModal from "@/components/admin/DeleteModal";
import PhotoForm from "@/components/admin/features/photo/PhotoForm";
import Pagination from "@/components/common/Pagination";
import { useAlbumStore } from "@/stores/albumStore";
import { useCategoryStore } from "@/stores/categoryStore";
import { usePhotoStore } from "@/stores/photoStore";
import PhotoFilter from "@/components/admin/features/photo/PhotoFilter";
import PhotoGrid from "@/components/admin/features/photo/PhotoGrid";
// import Loader from "@/components/common/Loader";
import LoaderBlock from "@/components/common/LoaderBlock";

export default function PhotosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { albums, fetchAlbums } = useAlbumStore();
  const { categories, fetchCategories } = useCategoryStore();
  const {
    photos,
    fetchPhotos,
    removePhoto,
    isModalOpen,
    closeModal,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    setPage,
    isLoading,
  } = usePhotoStore();

  useEffect(() => {
    fetchAlbums();
    fetchCategories();
    fetchPhotos(currentPage);
  }, [fetchAlbums, fetchCategories, fetchPhotos, currentPage]);

  const handlePageChange = (page: number) => {
    setPage(page); // cập nhật trang hiện tại trong store
    fetchPhotos(page); // gọi backend fetch dữ liệu trang mới
  };

  const handleDelete = () => {
    if (deleteId !== null) {
      removePhoto(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <PhotoFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        albums={albums}
        categories={categories}
      />

      {/* Photos Grid */}
      <PhotoGrid
        photos={photos}
        onDelete={setDeleteId}
        searchTerm={searchTerm}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems} // tổng item từ backend
        itemsPerPage={itemsPerPage} // số item mỗi trang
        onPageChange={handlePageChange}
      />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4  h-screen py-2 overflow-y-auto scrollbar-hide">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Upload ảnh</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-6 h-6 cursor-pointer" />
              </button>
            </div>
            <PhotoForm />
          </div>
        </div>
      )}
      {isLoading && (
        <LoaderBlock height={300} label="Đang tải danh sách ảnh..." />
      )}
      <DeleteModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        item="ảnh"
        itemName={photos.find((p) => p.id === deleteId)?.title}
      />
    </div>
  );
}
