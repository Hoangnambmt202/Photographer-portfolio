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
console.log(albums);
  // Filter states
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");


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
    <div className="space-y-6">
      {/* Header with Title and Add Button */}
      <AlbumFilter
        searchTerm={searchInput}
        filters={filters}
        onChangeFilters={(f) => {
          setFilters(f);
        }}
        onSearchChange={setSearchInput}
        onSearchSubmit={setSearchQuery}
        categories={categories}
      />

      {/* Albums Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {albums ? (
          albums.map((album) => (
            <div
              key={album.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 relative">
                <Image
                  src={(album.cover_image ?? placeholderImage) as string}
                  width={100}
                  height={100}
                  className="w-full h-full"
                  alt={album.title}
                />
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      album.status === "active"
                        ? "bg-green-100 text-green-700"
                        : album.status === "archived"
                        ? "bg-gray-100 text-gray-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {album.status === "active"
                      ? "Hoạt động"
                      : album.status === "archived"
                      ? "Lưu trữ"
                      : "Nháp"}
                  </span>
                </div>
                <div className="absolute top-2 left-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700`}
                  >
                    {album.photo_quantity ?? 0} ảnh
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold">{album.title}</h3>
                </div>
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  Danh mục:
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {album.category?.name || "Chưa phân loại"}
                  </span>
                </div>
                <div className="flex items-center text-gray-500 text-sm mb-4 gap-1">
                  Tags:
                  {album.tags?.map((tag) => {
                    return (
                      <span
                        key={tag.id}
                        className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded"
                      >
                        {tag.name}
                      </span>
                    );
                  })}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    onClick={() => {
                      router.push(`/admin/albums/${album.id}`);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">View</span>
                  </button>
                  <button className="flex items-center justify-center p-2 bg-gray-100 rounded-lg hover:bg-blue-400 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    className="flex items-center justify-center p-2 bg-blue-300 rounded-lg hover:bg-blue-400 transition-colors"
                    onClick={() => openEditModal(album)}
                  >
                    <Edit2 className="w-4 h-4 " />
                  </button>
                  <button
                    className="flex items-center justify-center p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    onClick={() => setDeleteId(album.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 mb-2">
              <Filter className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Không tìm thấy album
            </h3>
            <p className="text-gray-500 text-sm">
              Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
            </p>
          </div>
        )}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 !m-0 py-4 ">
          <div className="bg-white h-full rounded-xl shadow-2xl w-full max-h-140 max-w-md mx-4  overflow-y-auto scrollbar-hide">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {modalMode === "add" ? "Thêm album mới" : "Chỉnh sửa album"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <AlbumForm />
          </div>
        </div>
      )}
      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={12}
        onPageChange={handlePageChange}
      />
      <DeleteModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        item="album"
        itemName={"heelo"}
      />
    </div>
  );
}
