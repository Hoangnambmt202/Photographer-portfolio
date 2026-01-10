"use client";

// import InputImage from "@/components/common/InputImage";
import { useAlbumStore } from "@/stores/albumStore";
import { useTagStore } from "@/stores/tagStore";
import { useEffect } from "react";
import TagSelect from "@/components/admin/TagSelect";
import { useCategoryStore } from "@/stores/categoryStore";
import { AlbumStatus } from "@/types";
import InputImage from "@/components/common/InputImage";
import { Save } from "lucide-react";

interface AlbumFormProps {
  onClose?: () => void;
  onAlbumCreated?: (albumId: number) => void;
}

export default function AlbumForm({ onClose, onAlbumCreated }: AlbumFormProps) {
  const { formData, setFormData, addOrUpdateAlbum, closeModal, editingAlbum } = useAlbumStore();
  const { categories } = useCategoryStore();
  const { fetchTags } = useTagStore();

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  function toSlug(str: string) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "d")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = toSlug(title);
    setFormData({ title, slug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await addOrUpdateAlbum();
    if (onAlbumCreated && result.id) {
      onAlbumCreated(result.id);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col h-full"
      encType="multipart/form-data"
    >
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        
        {/* Title Field */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">
            Tên album <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Nhập tên album..."
            value={formData.title || ""}
            onChange={handleTitleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
          />
        </div>

        {/* Grid Layout for Slug & Category on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Slug (URL)</label>
                <input
                    type="text"
                    value={formData.slug || ""}
                    onChange={(e) => setFormData({ slug: e.target.value })}
                    className="w-full border border-gray-300 bg-gray-50 rounded-lg px-4 py-2.5 text-gray-600 text-sm focus:outline-none"
                    readOnly
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Danh mục</label>
                <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm bg-white"
                    value={formData.category ?? ""}
                    onChange={(e) => setFormData({ category: Number(e.target.value) })}
                >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                        {c.name}
                    </option>
                    ))}
                </select>
            </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">Mô tả</label>
          <textarea
            rows={3}
            placeholder="Mô tả ngắn về album..."
            value={formData.description || ""}
            onChange={(e) => setFormData({ description: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm resize-none"
          />
        </div>

        {/* Tags */}
        <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Thẻ (Tags)</label>
            <TagSelect
                defaultValues={formData.tags ?? []}
                onChange={(tagObjects) => {
                    setFormData({ tags: tagObjects });
                }}
            />
        </div>

        {/* Image Upload */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">Ảnh bìa (Thumbnail)</label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 hover:bg-gray-50 transition-colors">
              <InputImage />
          </div>
        </div>

        {/* Status */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">Trạng thái</label>
          <div className="relative">
            <select
                value={formData.status || "draft"}
                onChange={(e) => setFormData({ status: e.target.value as AlbumStatus })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm bg-white appearance-none"
            >
                <option value="active">🟢 Hoạt động (Public)</option>
                <option value="draft">⚪ Nháp (Draft)</option>
                <option value="archived">🔴 Lưu trữ (Archived)</option>
            </select>
            {/* Custom Arrow Icon */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions (Sticky Bottom) */}
      <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50/50 flex flex-col-reverse sm:flex-row justify-end gap-3 shrink-0">
        <button
          type="button"
          onClick={() => {
            closeModal();
            onClose?.();
          }}
          className="w-full sm:w-auto px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-white hover:shadow-sm transition-all focus:ring-2 focus:ring-gray-200"
        >
          Hủy bỏ
        </button>
        <button
          type="submit"
          className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          {editingAlbum ? "Cập nhật" : "Tạo Album"}
        </button>
      </div>
    </form>
  );
}