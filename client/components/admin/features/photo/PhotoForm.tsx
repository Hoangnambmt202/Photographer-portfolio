"use client";
import UploadButton from "@/components/common/UploadButton";
import { usePhotoStore } from "@/stores/photoStore";
import Image from "next/image";
import { useState } from "react";


export default function PhotoForm() {
  const { formData, setFormData, addOrUpdatePhoto, closeModal, editingPhoto } =
    usePhotoStore();
  const [uploadType, setUploadType] = useState<"file" | "drive">("file");
  const [file, setFile] = useState<File | null>(null);

  // 🔹 Tạo slug chỉ để hiển thị (server sẽ tự tạo)
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
            checked={uploadType === "file"}
            onChange={() => setUploadType("file")}
          />
          <span className="text-sm text-gray-700">Upload file ảnh</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={uploadType === "drive"}
            onChange={() => setUploadType("drive")}
          />
          <span className="text-sm text-gray-700">Link ảnh từ Drive</span>
        </label>
      </div>

      {/* Upload file */}
      {uploadType === "file" && (
        <div className="max-w-md mx-auto rounded-lg overflow-hidden md:max-w-xl">
      <div className="md:flex">
        <div className="w-full p-3">
          <div className="relative h-48 rounded-lg border-2 border-blue-500 bg-gray-50 flex justify-center items-center shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <div className="absolute flex flex-col items-center">
              <Image alt="File Icon" className="mb-3" src="https://img.icons8.com/dusk/64/000000/file.png" width={80} height={80} />
              <span className="block text-gray-500 font-semibold">Kéo &amp; Thả file tại đây</span>
              <span className="block text-gray-400 font-normal mt-1">hoặc click để upload</span>
            </div>
            <input className="h-full w-full opacity-0 cursor-pointer" type="file" accept="image/*"
  onChange={(e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  }} />
          </div>
        </div>
      </div>
    </div>
      )}

      {/* Upload từ Drive */}
      {uploadType === "drive" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Link ảnh từ Drive
          </label>
          <input
            type="text"
            value={formData.image_url || ""}
            onChange={(e) => setFormData({ image_url: e.target.value })}
            className=" px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
          />
            <label className="block text-sm font-medium text-gray-700">
            Upload từ drive
          </label>
            
        </div>
      </div>

      {/* Buttons */}
      <div className="flex space-x-3 pt-4 justify-end">
        <button
          type="button"
          onClick={closeModal}
          className=" px-4 py-2 border border-gray-400 text-gray-700 rounded-lg hover:bg-gray-50 transition"
        >
          Hủy
        </button>
        <UploadButton   />

      
      </div>
    </form>
  );
}
