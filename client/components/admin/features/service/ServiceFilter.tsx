import { Search } from "lucide-react";
export type ServiceStatus = "all" | "active" | "inactive";

interface ServiceFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categories: string[];
  filterCategory: string;
  onFilterCategoryChange: (value: string) => void;
  filterStatus: ServiceStatus;
  onFilterStatusChange: (value: ServiceStatus) => void;
  filteredCount: number;
  totalCount: number;
}

export default function ServiceFilters({
  searchTerm,
  onSearchChange,
  categories,
  filterCategory,
  onFilterCategoryChange,
  filterStatus,
  onFilterStatusChange,
  filteredCount,
  totalCount,
}: ServiceFiltersProps) {
   
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm dịch vụ..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 "
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => onFilterCategoryChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 "
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "all" ? "Tất cả danh mục" : cat}
            </option>
          ))}
        </select>

        <div className="flex gap-2 border border-gray-300 rounded-lg p-1">
          {["all", "active", "inactive"].map((status) => (
            <button
              key={status}
              onClick={() => onFilterStatusChange(status as ServiceStatus)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                filterStatus === status
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {status === "all"
                ? "Tất cả"
                : status === "active"
                ? "Đang hoạt động"
                : "Tạm dừng"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 text-sm text-gray-600">
        <span>
          Hiển thị <strong>{filteredCount}</strong> / <strong>{totalCount}</strong> dịch vụ
        </span>
      </div>
    </div>
  );
}
