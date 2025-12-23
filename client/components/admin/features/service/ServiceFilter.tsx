import SearchInput from "@/components/common/SearchInput";
export type ServiceStatus = "all" | "active" | "inactive" | "draft";

interface ServiceFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearch: (value: string) => void;
  categories: string[];
  filterCategory: string;
  onFilterCategoryChange: (value: string) => void;
  filterStatus: ServiceStatus;
  onFilterStatusChange: (value: ServiceStatus) => void;
  filteredCount: number;
  totalCount: number;
  loading?: boolean;
}

export default function ServiceFilters({
  searchTerm,
  onSearchChange,
  onSearch,
  categories,
  filterCategory,
  onFilterCategoryChange,
  filterStatus,
  onFilterStatusChange,
  filteredCount,
  totalCount,
  loading = false,
}: ServiceFiltersProps) {
   
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[250px]">
          <SearchInput
            placeholder="Tìm kiếm dịch vụ..."
            value={searchTerm}
            onChange={onSearchChange}
            onSearch={onSearch}
            loading={loading}
            className="w-full"
            delay={400}
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => onFilterCategoryChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 "
        >
          <option value="all">Tất cả danh mục</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <div className="flex gap-2 border border-gray-300 rounded-lg p-1">
          {["all", "active", "inactive", "draft"].map((status) => (
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
                : status === "inactive"
                ? "Tạm dừng"
                : "Bản nháp"}
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