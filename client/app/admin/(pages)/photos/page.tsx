"use client";

import DeleteModal from "@/components/admin/DeleteModal";
import PhotoForm from "@/components/admin/features/photo/PhotoForm";
import { Button } from "@/components/common/button";
import Pagination from "@/components/common/pagination";
import { useAlbumStore } from "@/stores/albumStore";
import { useCategoryStore } from "@/stores/categoryStore";
import { usePhotoStore } from "@/stores/photoStore";
import { Download, Eye, Trash2, Upload, Filter, X, Calendar } from "lucide-react";
import { useEffect, useState } from "react";

export default function PhotosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAlbum, setSelectedAlbum] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [minWidth, setMinWidth] = useState("");
  const [maxWidth, setMaxWidth] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [deleteId, setDeleteId] = useState<number | null>(null);
  
  const {albums, fetchAlbums} =useAlbumStore();
  const {categories, fetchCategories} = useCategoryStore();
  const {photos, fetchPhotos, removePhoto, isModalOpen, closeModal, addOrUpdatePhoto, openAddModal } = usePhotoStore();

  const created_at = ["11/02/2025", "11/02/2025" ];
  useEffect(()=> {
    fetchAlbums();
    fetchCategories();
    fetchPhotos();
  }, [fetchAlbums, fetchCategories, fetchPhotos]);
  // Filter logic
  const filteredPhotos = photos
    .filter((photo) => {
      // Search
      if (searchTerm && !photo.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      // Album
      if (selectedAlbum !== "all" && albums) return false;
      // Category
      if (selectedCategory !== "all" && categories) return false;
      // Date range
      // if (dateFrom && new Date(photo.taken_at) < new Date(dateFrom)) return false;
      // if (dateTo && new Date(photo.taken_at) > new Date(dateTo)) return false;
      // // Width filter
      // if (minWidth && photo.width < Number(minWidth)) return false;
      // if (maxWidth && photo.width > Number(maxWidth)) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "title") {
        return sortOrder === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
      } 
      // else {
      //   return sortOrder === "asc" ? a.created_at.getTime() - b.created_at.getTime()
      //     : b.created_at.getTime() - a.created_at.getTime();
        
      // }
    }
  );

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedAlbum("all");
    setSelectedCategory("all");
    setDateFrom("");
    setDateTo("");
    setMinWidth("");
    setMaxWidth("");
    setSortBy("date");
    setSortOrder("desc");
  };

  const hasActiveFilters =
    searchTerm !== "" ||
    selectedAlbum !== "all" ||
    selectedCategory !== "all" ||
    dateFrom !== "" ||
    dateTo !== "" ||
    minWidth !== "" ||
    maxWidth !== "" ||
    sortBy !== "date" ||
    sortOrder !== "desc";

  const handleDelete = () => {
    if (deleteId !== null) {
      removePhoto(deleteId);
      setDeleteId(null);
    }
  };
  
    
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Ảnh</h1>
        <Button className="group flex items-center space-x-2 px-4 py-2 gap-2 cursor-pointer outline-none bg-green-500 hover:bg-green-700 rounded-lg" onClick={openAddModal}>
          <Upload className="w-5 h-5" />
          <span className="text-white">Upload Ảnh</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[250px]">
            <input
              type="text"
              placeholder="Tìm kiếm ảnh..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <select
            value={selectedAlbum}
            onChange={(e) => setSelectedAlbum(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="all">Tất cả album</option>
            {albums.map((a) => (
              <option key={a.id} value={a.id}>
                {a.title}
              </option>
            ))}
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="all">Tất cả danh mục</option>

            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option  >
            ))}
          </select>

          {/* Advanced filter toggle */}
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

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200"
            >
              <X className="w-4 h-4" />
              <span>Xóa bộ lọc</span>
            </button>
          )}
        </div>

        {/* Advanced filter */}
        {showAdvancedFilter && (
          <div className="pt-4 border-t border-gray-200 space-y-4 animate-in slide-in-from-top duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Date range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" /> Khoảng thời gian
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none  focus:border-blue-500 text-sm"
                  />
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none  focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Width filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chiều rộng</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={minWidth}
                    onChange={(e) => setMinWidth(e.target.value)}
                    placeholder="Tối thiểu"
                    className="w-[100px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <input
                    type="number"
                    value={maxWidth}
                    onChange={(e) => setMaxWidth(e.target.value)}
                    placeholder="Tối đa"
                    className="w-[100px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sắp xếp
                </label>
                <div className="flex gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="date">Ngày upload</option>
                    <option value="name">Tên ảnh</option>
                    <option value="width">Chiều rộng</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredPhotos.length > 0 ? (
          filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group"
            >
              <div className="relative h-48 bg-gray-200">
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                    <button className="p-2 bg-white rounded-lg">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-white rounded-lg">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-white rounded-lg text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-3">
                <p className="font-medium text-sm truncate">{photo.title}</p>
                {/* <p className="text-xs text-gray-500">{photo.width}x{photo.height}</p> */}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            Không tìm thấy ảnh
          </div>
        )}
      </div>
{isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Upload ảnh</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <PhotoForm />
          </div>
        </div>
      )}
      <DeleteModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        item="ảnh"
        itemName={filteredPhotos.find((photo) => photo.id === deleteId)?.title}
      />
      {/* Pagination */}
      <Pagination />
    </div>
  );
}
