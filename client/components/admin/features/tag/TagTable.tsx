"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus, Search, ChevronUp, ChevronDown } from "lucide-react";
import { useTagStore } from "@/stores/tagStore";
import DeleteModal from "../../DeleteModal"; // Đảm bảo đường dẫn đúng
import { showToast } from "nextjs-toast-notify";

interface SortConfig {
  key: 'id' | 'name' | 'slug';
  direction: 'asc' | 'desc';
}

const sortKeys = {
  id: 'ID',
  name: 'Tên',
  slug: 'Slug',
};

export default function TagTable() {
  const { tags, openAddModal, openEditModal, deleteTag } = useTagStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'id', direction: 'asc' });
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  
  // State quản lý xóa
  const [deleteId, setDeleteId] = useState<number | null>(null); // Xóa đơn
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false); // Xóa nhiều

  // --- Logic Lọc & Sắp xếp (Giữ nguyên) ---
  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tag.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tag.id.toString().includes(searchTerm)
  );

  const sortedTags = [...filteredTags].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (sortConfig.key === 'id') {
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    } else {
      const aStr = String(aValue || '').toLowerCase();
      const bStr = String(bValue || '').toLowerCase();
      if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    }
  });

  const handleSort = (key: 'id' | 'name' | 'slug') => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAll = () => {
    if (selectedTags.length === sortedTags.length) {
      setSelectedTags([]);
    } else {
      setSelectedTags(sortedTags.map(tag => tag.id));
    }
  };

  const handleSelectTag = (id: number) => {
    setSelectedTags(prev =>
      prev.includes(id) ? prev.filter(tagId => tagId !== id) : [...prev, id]
    );
  };

  // --- Logic Xóa mới ---

  // 1. Xác nhận xóa đơn
  const confirmSingleDelete = () => {
    if (deleteId !== null) {
      deleteTag(deleteId);
      
      // Nếu tag đang xóa nằm trong danh sách đã chọn, bỏ chọn nó
      if (selectedTags.includes(deleteId)) {
        setSelectedTags(prev => prev.filter(id => id !== deleteId));
      }

      setDeleteId(null);
      showToast.success("Xóa tag thành công!", { duration: 1500 });
    }
  };

  // 2. Mở modal xóa nhiều (Action click button Header)
  const handleBulkDeleteClick = () => {
    setIsBulkDeleteOpen(true);
  };

  // 3. Xác nhận xóa nhiều (Action click Confirm trong Modal)
  const confirmBulkDelete = () => {
    selectedTags.forEach(id => deleteTag(id));
    setSelectedTags([]);
    setIsBulkDeleteOpen(false);
    showToast.success(`Đã xóa ${selectedTags.length} tag thành công!`, { duration: 1500 });
  };

  // Helper render icon sort
  const SortIcon = ({ columnKey }: { columnKey: 'id' | 'name' | 'slug' }) => {
    if (sortConfig.key !== columnKey) return <ChevronUp className="w-4 h-4 opacity-30" />;
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-blue-600" /> 
      : <ChevronDown className="w-4 h-4 text-blue-600" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Quản lý Tags</h2>
            <p className="text-gray-600 mt-1">Tổng cộng {tags.length} tags</p>
          </div>
          
          <div className="flex items-center gap-3">
            {selectedTags.length > 0 && (
              <button
                onClick={handleBulkDeleteClick} // Gọi modal
                className="px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium flex items-center gap-2 transition-colors animate-in fade-in zoom-in duration-200"
              >
                <Trash2 className="w-4 h-4" />
                Xóa ({selectedTags.length})
              </button>
            )}
            
            <button
              onClick={openAddModal}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Thêm Tag Mới
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm tags theo tên, slug hoặc ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="p-4 w-12 text-center">
                <input
                  type="checkbox"
                  checked={selectedTags.length === sortedTags.length && sortedTags.length > 0}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                />
              </th>
              {(Object.keys(sortKeys) as Array<keyof typeof sortKeys>).map((key) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="p-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors group select-none"
                >
                  <div className="flex items-center gap-2">
                    {sortKeys[key]}
                    <div className="flex flex-col">
                      <SortIcon columnKey={key} />
                    </div>
                  </div>
                </th>
              ))}
              <th className="p-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-200">
            {sortedTags.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      {searchTerm ? "Không tìm thấy kết quả" : "Chưa có tag nào"}
                    </h3>
                    <p className="text-gray-500">
                      {searchTerm 
                        ? `Không tìm thấy tag phù hợp với "${searchTerm}"`
                        : "Bắt đầu bằng cách thêm tag đầu tiên"}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedTags.map((tag) => (
                <tr 
                  key={tag.id} 
                  className={`hover:bg-gray-50 transition-colors ${
                    selectedTags.includes(tag.id) ? 'bg-blue-50' : ''
                  }`}
                >
                  <td className="p-4 text-center">
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag.id)}
                      onChange={() => handleSelectTag(tag.id)}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                    />
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {tag.id}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{tag.name}</div>
                  </td>
                  <td className="p-4">
                    <code className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm font-mono">
                      {tag.slug}
                    </code>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(tag)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors group"
                        title="Sửa"
                      >
                        <Pencil className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      </button>
                      <button
                        onClick={() => setDeleteId(tag.id)} // Gọi modal xóa đơn
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info & Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-sm text-gray-700">
            Hiển thị <span className="font-semibold">{sortedTags.length}</span> trên tổng số{" "}
            <span className="font-semibold">{tags.length}</span> tags
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-700">
              {selectedTags.length > 0 && (
                <span className="text-blue-600 font-medium">
                  Đã chọn {selectedTags.length} tags
                </span>
              )}
            </div>
            
            {/* Pagination Placeholder */}
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50" disabled>←</button>
              <span className="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-medium">1</span>
              <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50" disabled={sortedTags.length === 0}>→</button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Unified Delete Modal --- */}
      <DeleteModal
        isOpen={deleteId !== null || isBulkDeleteOpen}
        onClose={() => {
          setDeleteId(null);
          setIsBulkDeleteOpen(false);
        }}
        onConfirm={deleteId !== null ? confirmSingleDelete : confirmBulkDelete}
        // Xử lý logic hiển thị text cho phù hợp ngữ cảnh
        item={deleteId !== null ? "tag" : ""} 
        itemName={
          deleteId !== null 
            ? tags.find((tag) => tag.id === deleteId)?.name 
            : `${selectedTags.length} tag đã chọn`
        }
      />
    </div>
  );
}