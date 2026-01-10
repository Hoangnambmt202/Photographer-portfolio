"use client";

import AlbumForm from "@/components/admin/features/album/AlbumForm";
import DeleteModal from "@/components/admin/DeleteModal";
import { useAlbumStore } from "@/stores/albumStore";
import { Edit2, Eye, Trash2, Filter, X, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useCategoryStore } from "@/stores/categoryStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AlbumFilter from "@/components/admin/features/album/AlbumFilter";
import Pagination from "@/components/common/Pagination";

export default function AlbumsPage() {
  const {
    albums,
    filters,
    modalMode,
    isModalOpen,
    currentPage,
    totalPages,
    totalItems,
    setFilters,
    setPage,
    fetchAlbums,
    openEditModal,
    removeAlbum,
    closeModal,
  } = useAlbumStore();
  const { categories, fetchCategories } = useCategoryStore();

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    setFilters({
      ...filters,
      search: searchQuery || undefined,
    });
  }, [searchQuery]);

  useEffect(() => {
    fetchAlbums(currentPage, filters);
  }, [currentPage, filters]);

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const placeholderImage =
    "https://images.unsplash.com/photo-1654124803058-c814dc42f60c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  const handleDelete = () => {
    if (deleteId !== null) {
      removeAlbum(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <>
    
    <div className="space-y-6 pb-20 md:pb-0"> {/* Padding bottom for mobile scrolling */}
      
      {/* Filter Component */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <AlbumFilter
            searchTerm={searchInput}
            filters={filters}
            onChangeFilters={(f) => setFilters(f)}
            onSearchChange={setSearchInput}
            onSearchSubmit={setSearchQuery}
            categories={categories}
          />
      </div>

      {/* Albums Grid - Responsive Columns */}
      {/* Mobile: 1 col, SM: 2 cols, LG: 3 cols, XL: 4 cols */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {albums ? (
          albums.map((album) => (
            <div
              key={album.id}
              className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              {/* Image Container */}
              <div className="h-56 sm:h-48 bg-gray-100 relative overflow-hidden">
                <Image
                  src={(album.cover_image ?? placeholderImage) as string}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  alt={album.title}
                />
                
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md ${
                      album.status === "active"
                        ? "bg-green-500/90 text-white"
                        : album.status === "archived"
                        ? "bg-gray-500/90 text-white"
                        : "bg-yellow-500/90 text-white"
                    }`}
                  >
                    {album.status === "active"
                      ? "Hoạt động"
                      : album.status === "archived"
                      ? "Lưu trữ"
                      : "Nháp"}
                  </span>
                </div>

                {/* Photo Count Badge */}
                <div className="absolute bottom-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-black/60 text-white backdrop-blur-sm">
                    {album.photo_quantity ?? 0} ảnh
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-1" title={album.title}>
                    {album.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                        {album.category?.name || "Chưa phân loại"}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4 flex-1 content-start">
                  {album.tags?.slice(0, 3).map((tag) => (
                    <span
                      key={tag.id}
                      className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200"
                    >
                      #{tag.name}
                    </span>
                  ))}
                  {album.tags && album.tags.length > 3 && (
                      <span className="text-[10px] text-gray-400 px-1">+{album.tags.length - 3}</span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-4 gap-2 pt-3 border-t border-gray-100">
                  <button
                    className="col-span-1 flex items-center justify-center p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    onClick={() => router.push(`/admin/albums/${album.id}`)}
                    title="Xem chi tiết"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    className="col-span-1 flex items-center justify-center p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-colors"
                    title="Chia sẻ"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    className="col-span-1 flex items-center justify-center p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-yellow-50 hover:text-yellow-600 transition-colors"
                    onClick={() => openEditModal(album)}
                    title="Chỉnh sửa"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    className="col-span-1 flex items-center justify-center p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 hover:text-red-600 transition-colors"
                    onClick={() => setDeleteId(album.id)}
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
            <div className="bg-gray-50 p-4 rounded-full mb-3">
                <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Không tìm thấy album</h3>
            <p className="text-gray-500 text-sm mt-1">Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
          </div>
        )}
      </div>

     

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={12}
        onPageChange={handlePageChange}
      />

      
    </div>
     {/* Modal - Responsive padding */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 shrink-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                {modalMode === "add" ? "Thêm album mới" : "Chỉnh sửa album"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-thin">
                <AlbumForm />
            </div>
          </div>
        </div>
      )}
      <DeleteModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        item="album"
        itemName={albums.find((album) => album.id === deleteId)?.title || ""}
      />
    </>
    
  );
}