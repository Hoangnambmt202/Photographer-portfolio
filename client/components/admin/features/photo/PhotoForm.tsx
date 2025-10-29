"use client";
import { usePhotoStore } from "@/stores/photoStore";

export default function PhotoForm() {
  const { formData, setFormData, addOrUpdatePhoto, closeModal, editingPhoto } =
    usePhotoStore();

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addOrUpdatePhoto();
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tên ảnh
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={handleTitleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Nhập tên ảnh"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Slug
        </label>
        <input
          type="text"
          value={formData.slug}
          onChange={(e) => setFormData({ slug: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
        />
        <p className="text-xs text-gray-500 mt-1">
          Slug tự động tạo, có thể chỉnh.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Chi tiết
        </label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ description: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
        />
      </div>
      <div className="flex justify-between">
        <div className="flex items-center gap-1">
          
          <input
            type="radio"
            value={formData.description}
            onChange={(e) => setFormData({ image_url: e.target.value })}
            className=" px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
          />
          <label className="block text-sm font-medium text-gray-700">
            Upload file ảnh
          </label>
        </div>
        <div className="flex items-center gap-1">
            <input
            type="radio"
            value={formData.description}
            onChange={(e) => setFormData({ image_url: e.target.value })}
            className=" px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
          />
            <label className="block text-sm font-medium text-gray-700">
            Upload từ drive
          </label>
            
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={closeModal}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {editingPhoto ? "Cập nhật" : "Thêm mới"}
        </button>
      </div>
    </form>
  );
}
