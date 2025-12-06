"use client";
import InputImage from "@/components/common/InputImage";
import { useAlbumStore } from "@/stores/albumStore";
import { useTagStore } from "@/stores/tagStore";
import { useEffect } from "react";
import TagSelect from "@/components/admin/TagSelect";

interface AlbumFormProps {
  onClose?: () => void;
  onAlbumCreated?: (albumId: number) => void;
}

export default function AlbumForm({ onClose, onAlbumCreated }: AlbumFormProps) {
  const { formData, setFormData, addOrUpdateAlbum, closeModal, editingAlbum } =
    useAlbumStore();
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
    // Call callback if provided (for creating album from photo form)
    if (onAlbumCreated && result?.data?.id) {
      onAlbumCreated(result.data.id);
    }
    if (onClose) {
      onClose();
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 "
      encType="multipart/form-data"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tên album
        </label>
        <input
          type="text"
          value={formData.title || ""}
          onChange={handleTitleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm mb-2">Slug</label>
        <input
          type="text"
          value={formData.slug || ""}
          onChange={(e) => setFormData({ slug: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm mb-2">Mô tả</label>
        <textarea
          value={formData.description || ""}
          onChange={(e) => setFormData({ description: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <TagSelect
        defaultValues={formData.tags ?? []}
        onChange={(tagObjects) => {
          setFormData({ tags: tagObjects });
        }}
      />

      <div>
        <label htmlFor="">Ảnh thumbnail album</label>
        <InputImage />
      </div>

      <div>
        <label className="block text-sm mb-2">Trạng thái</label>
        <select
          value={formData.status || "draft"}
          onChange={(e) => setFormData({ status: e.target.value })}
          className="w-full border rounded px-3 py-2"
        >
          <option value="active">Hoạt động</option>
          <option value="draft">Nháp</option>
          <option value="archived">Lưu trữ</option>
        </select>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => {
            closeModal();
            onClose?.();
          }}
          className="px-4 py-2 border rounded"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {editingAlbum ? "Cập nhật" : "Thêm mới"}
        </button>
      </div>
    </form>
  );
}
