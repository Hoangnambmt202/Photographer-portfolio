/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { Filter, X, Calendar, Upload } from "lucide-react";
import SearchInput from "@/components/common/SearchInput";
import { usePhotoStore } from "@/stores/photoStore";
import type { PhotoFilters } from "@/types";

interface PhotoFiltersProps {
  searchTerm: string;
  filters: PhotoFilters;
  albums: any[];
  categories: any[];
  onSearchChange: (value: string) => void;
  onSearchSubmit: (v: string) => void;
  onChangeFilters: (filters: PhotoFilters) => void;
}

export default function PhotoFilters({
  searchTerm,
  filters,
  albums,
  categories,
  onSearchChange,
  onSearchSubmit,
  onChangeFilters,
}: PhotoFiltersProps) {
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");


  const { openAddModal, isLoading } = usePhotoStore();
  const statuses = [
    { value: "draft", label: "Nháp" },
    { value: "public", label: "Công khai" },
    { value: "private", label: "Riêng tư" },
    { value: "archived", label: "Lưu trữ" },
  ];
  const update = (patch: Partial<PhotoFilters>) => {
    onChangeFilters({
      ...filters,
      ...patch,
    });
  };

  const resetFilters = () => {
    onChangeFilters({});
  };

  const hasActiveFilters = Object.values(filters).some(Boolean);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[150px]">
          <SearchInput
            placeholder="Tìm kiếm ảnh..."
            value={searchTerm}
            onChange={onSearchChange} 
            onSearch={onSearchSubmit}
            loading={isLoading}
          />
        </div>
        <select
          value={filters.album_id ?? "all"}
          onChange={(e) =>
            update({
              album_id:
                e.target.value === "all" ? undefined : Number(e.target.value),
            })
          }
          className="px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
        >
          <option value="all">Tất cả album</option>
          {albums.map((a: any) => (
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
          <option value="all">Danh mục</option>
          {categories.map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={filters.status ?? "all"}
          onChange={(e) =>
            update({
              status:
                e.target.value === "all" ? undefined : (e.target.value as any),
            })
          }
          className="px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
        >
          <option value="all">Trạng thái</option>
          {statuses.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
        <button
          onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
            showAdvancedFilter
              ? "bg-blue-50 border-blue-500 text-blue-700"
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Filter className="w-4 h-4" />
        </button>
        <button
          className="flex gap-2 bg-green-500 hover:bg-green-600 cursor-pointer text-white px-4 py-2 rounded-lg"
          onClick={openAddModal}
        >
          <Upload />
          Upload ảnh
        </button>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200"
          >
            <X className="w-4 h-4" /> Xóa bộ lọc
          </button>
        )}
      </div>

      {showAdvancedFilter && (
        <div className="pt-4 border-t border-gray-200 space-y-4 animate-in slide-in-from-top duration-300">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" /> Khoảng thời gian
          </label>
          <div className="flex gap-2">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
}
