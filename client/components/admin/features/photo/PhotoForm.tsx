"use client";
import UploadButton from "@/components/common/UploadButton";
import { usePhotoStore } from "@/stores/photoStore";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function PhotoForm() {
  const { formData, setFormData, addOrUpdatePhoto, closeModal } =
    usePhotoStore();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    // Khi edit album, load ảnh từ DB
    if (formData.image_url && typeof formData.image_url === "string") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreview(formData.image_url);
    }
  }, [formData.image_url]);
  // Tạo slug
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData({ image_url: file });

    setPreview(URL.createObjectURL(file));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addOrUpdatePhoto();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 space-y-4 overflow-y-auto scrollbar-hide"
    >
      {/* Tên ảnh */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tên ảnh
        </label>
        <input
          type="text"
          value={formData.title ?? ""}
          onChange={handleTitleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          placeholder="Nhập tên ảnh"
          required
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Slug
        </label>
        <input
          type="text"
          value={formData.slug ?? ""}
          onChange={(e) => setFormData({ slug: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
        />
      </div>

      {/* Chi tiết */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Chi tiết
        </label>
        <input
          type="text"
          value={formData.description ?? ""}
          onChange={(e) => setFormData({ description: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
        />
      </div>
      {/* Trạng thái */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Trạng thái
        </label>
        <select
          value={formData.status || "draft"}
          onChange={(e) => setFormData({ status: e.target.value })}
          className="w-full border rounded px-3 py-2"
        >
          <option value="public">Công khai</option>
          <option value="private">Riêng tư</option>
          <option value="draft">Nháp</option>
          <option value="archived">Lưu trữ</option>
        </select>
      </div>

      {/* Upload file */}
      <div className="max-w-md mx-auto rounded-lg overflow-hidden md:max-w-xl">
        <div className="md:flex">
          <div className="w-full p-3">
            <div className="relative h-48 rounded-lg border-2 border-blue-500 bg-gray-50 flex justify-center items-center shadow-lg hover:shadow-xl transition">
              {/* Preview nếu có ảnh */}
              {preview ? (
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-cover rounded-lg"
                />
              ) : (
                <div className="absolute text-center pointer-events-none ">
                  <Image
                    src="https://img.icons8.com/dusk/64/000000/file.png"
                    alt="icon"
                    width={80}
                    height={80}
                    className="text-center"
                  />
                  <p className="text-gray-500">Kéo thả hoặc click để upload</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="h-full w-full opacity-0 cursor-pointer"
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex space-x-3 pt-4 justify-end">
        <button
          type="button"
          onClick={closeModal}
          className="px-4 py-2 border border-gray-400 text-gray-700 rounded-lg hover:bg-gray-50 transition"
        >
          Hủy
        </button>
        <UploadButton />
      </div>
    </form>
  );
}
