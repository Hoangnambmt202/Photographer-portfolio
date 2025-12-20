/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Calendar, X } from "lucide-react";
import SearchInput from "@/components/common/SearchInput";
import type { AlbumFilters, AlbumStatus } from "@/types";
import { useAlbumStore } from "@/stores/albumStore";
import { useState } from "react";

interface AlbumFilterProps {
  searchTerm: string;
  filters: AlbumFilters;
  categories: any[];
  onSearchChange: (v: string) => void;
  onSearchSubmit: (v: string) => void;
  onChangeFilters: (filters: AlbumFilters) => void;

}

export default function AlbumFilter({
  searchTerm,
  filters,
  categories,
  onSearchChange,
  onSearchSubmit,
  onChangeFilters,

}: AlbumFilterProps) {

  const {isLoading, openAddModal} = useAlbumStore();
  const update = (patch: Partial<AlbumFilters>) => {
    onChangeFilters({
      ...filters,
      ...patch,
    });
  };
  const resetFilters = () => {
    onChangeFilters({});
  };
  const statuses = [
    { value: "draft", label: "Nháp" },
    { value: "active", label: "Hoạt động" },
    { value: "archived", label: "Lưu trữ" },
  ];
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const hasActiveFilters = Object.values(filters).some(Boolean);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[150px]">
          <SearchInput
            placeholder="Tìm kiếm album..."
            value={searchTerm}
            onChange={onSearchChange}
            onSearch={onSearchSubmit}
            loading={isLoading}
          />
        </div>

        <select
          value={filters.category_id ?? "all"}
          onChange={(e) =>
            update({
              category_id:
                e.target.value === "all"
                  ? undefined
                  : Number(e.target.value),
            })
          }
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">Danh mục</option>
          {categories.map((c) => (
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
                e.target.value === "all"
                  ? undefined
                  : (e.target.value as AlbumStatus),
            })
          }
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">Trạng thái</option>
          {
            statuses.map((value) => {
              return (
                <option key={value.value} value={value.value}>{value.label}</option>
              )
            })
          }
        </select>

        <button
          onClick={openAddModal}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Thêm album
        </button>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-2 px-4 py-2 text-red-600 border rounded-lg"
          >
            <X className="w-4 h-4" /> Xóa lọc
          </button>
        )}
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
    </div>
  );
}
