"use client";

import AlbumForm from "@/components/admin/features/album/AlbumForm";
import DeleteModal from "@/components/admin/DeleteModal";
import { Button } from "@/components/common/Button";
import { useAlbumStore } from "@/stores/albumStore";
import {
  Edit2,
  Eye,
  Trash2,
  Filter,
  X,
  Calendar,
  Image as ImageIcon,
  SortAsc,
  SortDesc,
  Share2,
} from "lucide-react";
import { useEffect, useState } from "react";
import SearchInput from "@/components/common/SearchInput";
import { useCategoryStore } from "@/stores/categoryStore";
import Image from "next/image";
import {useRouter} from "next/navigation";

export default function AlbumsPage() {
  const {
    albums,
    fetchAlbums,
    openAddModal,
    openEditModal,
    removeAlbum,
    isModalOpen,
    closeModal,
    modalMode,
  } = useAlbumStore();
  const {categories, fetchCategories} = useCategoryStore() 

  // Filter states
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [minPhotos, setMinPhotos] = useState("");
  const [maxPhotos, setMaxPhotos] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const router = useRouter();
  useEffect(() => {
    fetchAlbums();
    fetchCategories();
  }, [fetchAlbums, fetchCategories]);
  // Categories và statuses
  const statuses = ["all", "active", "archived", "draft"];
const placeholderImage = "https://images.unsplash.com/photo-1654124803058-c814dc42f60c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  // Filter và sort logic
  const filteredAlbums = albums
    .filter((album) => {
      // Search filter
      if (
        searchTerm &&
        !album.title.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Category filter
      // if (selectedCategory !== "all" && album.category !== selectedCategory) {
      //   return false;
      // }

      // Status filter
      if (selectedStatus !== "all" && album.status !== selectedStatus) {
        return false;
      }

      // Date range filter
      // if (dateFrom && album.created_at < dateFrom) {
      //   return false;
      // }
      // if (dateTo && album.created_at > dateTo) {
      //   return false;
      // }

      // Photos count filter
      if (minPhotos < minPhotos) {
        return false;
      }
      if (maxPhotos > maxPhotos) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      let compareValue = 0;

      switch (sortBy) {
        case "title":
          compareValue = a.title.localeCompare(b.title);
          break;
      }

      return sortOrder === "asc" ? compareValue : -compareValue;
    });

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedStatus("all");
    setDateFrom("");
    setDateTo("");
    setMinPhotos("");
    setMaxPhotos("");
    setSortBy("date");
    setSortOrder("desc");
  };

  // Check if any filter is active
  const hasActiveFilters =
    searchTerm ||
    selectedCategory !== "all" ||
    selectedStatus !== "all" ||
    dateFrom ||
    dateTo ||
    minPhotos ||
    maxPhotos ||
    sortBy !== "date" ||
    sortOrder !== "desc";
  const handleDelete = () => {
    if (deleteId !== null) {
      removeAlbum(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Title and Add Button */}
      <div className="flex items-center">
        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-4 flex-1">
          {/* Basic Filters - Always visible */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[150px]">
              <SearchInput
                placeholder="Tìm kiếm album..."
                onSearch={async (value) => {
                  // giả lập API
                  await new Promise((r) => setTimeout(r, 800));
                  setSearchTerm(value);
                }}
              />
            </div>

            {/* Category Quick Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border  rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Danh mục</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Status Quick Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === "all"
                    ? "Tất cả trạng thái"
                    : status === "active"
                    ? "Đang hoạt động"
                    : status === "archived"
                    ? "Đã lưu trữ"
                    : "Nháp"}
                </option>
              ))}
            </select>

            {/* Advanced Filter Toggle */}
            <button
              onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                showAdvancedFilter
                  ? "bg-blue-50 border-blue-500 text-blue-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Bộ lọc nâng cao</span>
            </button>
            <Button
              className="group flex items-center space-x-2 px-4 py-2 gap-2 cursor-pointer outline-none bg-green-500 hover:bg-green-700 rounded-lg"
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

            {/* Reset Button */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Xóa bộ lọc</span>
              </button>
            )}
          </div>

          {/* Advanced Filters - Collapsible */}
          {showAdvancedFilter && (
            <div className="pt-4 border-t border-gray-200 space-y-4 animate-in slide-in-from-top duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Khoảng thời gian
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Từ"
                    />
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Đến"
                    />
                  </div>
                </div>

                {/* Photos Count Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <ImageIcon className="w-4 h-4 inline mr-1" />
                    Số lượng ảnh
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={minPhotos}
                      onChange={(e) => setMinPhotos(e.target.value)}
                      placeholder="Tối thiểu"
                      className="w-[100px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <input
                      type="number"
                      value={maxPhotos}
                      onChange={(e) => setMaxPhotos(e.target.value)}
                      placeholder="Tối đa"
                      className="w-[100px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>

                {/* Sort Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {sortOrder === "asc" ? (
                      <SortAsc className="w-4 h-4 inline mr-1" />
                    ) : (
                      <SortDesc className="w-4 h-4 inline mr-1" />
                    )}
                    Sắp xếp theo
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className=" px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="date">Ngày tạo</option>
                      <option value="name">Tên album</option>
                      <option value="photos">Số ảnh</option>
                    </select>
                    <button
                      onClick={() =>
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {sortOrder === "asc" ? (
                        <SortAsc className="w-4 h-4" />
                      ) : (
                        <SortDesc className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results count */}
          <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t border-gray-200">
            <span>
              Hiển thị <strong>{filteredAlbums.length}</strong> /{" "}
              {albums.length} albums
            </span>
            {hasActiveFilters && (
              <span className="text-blue-600">Đang áp dụng bộ lọc</span>
            )}
          </div>
        </div>
      </div>

      {/* Albums Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlbums.length > 0 ? (
          filteredAlbums.map((album) => (
            <div
              key={album.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="h-48 bg-linear-to-br from-blue-100 to-purple-100 relative">
                <Image src={(album.cover_image ?? placeholderImage ) as string}  width={100} height={100} className="w-full h-full" alt={album.title}/>
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
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold">{album.title}</h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {/* {album.category} */}
                  </span>
                </div>
                <div className="flex items-center justify-between text-gray-500 text-sm mb-4">
                  {/* <span>{album.photos} photos</span> */}
                  <span>
                    {/* {new Date(album.created_at).toLocaleDateString("vi-VN")} */}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors" onClick={() => {
                    router.push(`/admin/albums/${album.id}`)
                  }}>
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">View</span>
                  </button>
                  <button  className="flex items-center justify-center p-2 bg-gray-100 rounded-lg hover:bg-blue-400 transition-colors">
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
        <div className="fixed inset-0 bg-black/60  flex items-center justify-center z-50 ">
          <div className="bg-white rounded-xl shadow-2xl w-full max-h-140 max-w-md mx-4  overflow-y-auto scrollbar-hide">
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
      <DeleteModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        item="album"
        itemName={filteredAlbums.find((album) => album.id === deleteId)?.title}
      />
    </div>
  );
}
