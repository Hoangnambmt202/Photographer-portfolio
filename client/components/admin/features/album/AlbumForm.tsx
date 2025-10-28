"use client";
import { useAlbumStore } from "@/stores/albumStore";

export default function AlbumForm() {
  const { formData, setFormData, addOrUpdateAlbum, closeModal, editingAlbum } =
    useAlbumStore();

  function toSlug(str: string) {
    return str
      .normalize("NFD") // tách dấu khỏi ký tự
      .replace(/[\u0300-\u036f]/g, "") // xóa dấu
      .replace(/đ/g, "d")
      .replace(/Đ/g, "d")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // thay ký tự đặc biệt bằng dấu "-"
      .replace(/^-+|-+$/g, ""); // xóa dấu "-" đầu và cuối
  }
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = toSlug(title);
    setFormData({ title, slug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addOrUpdateAlbum();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6">
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

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={closeModal}
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
