"use client";
import UploadButton from "@/components/common/UploadButton";
import { usePhotoStore } from "@/stores/photoStore";
import { useAlbumStore } from "@/stores/albumStore";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import AlbumForm from "../album/AlbumForm";
import { PhotoStatus } from "@/types";
import LoaderInline from "@/components/common/LoaderInline";

export default function PhotoForm() {
  const {
    formData,
    setFormData,
    addOrUpdatePhoto,
    closeModal,
    editingPhoto,
    isUploading,
  } = usePhotoStore();
  const { albums } = useAlbumStore();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [showNewAlbumForm, setShowNewAlbumForm] = useState(false);

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

  const fileNameToTitle = (name: string) => name.replace(/\.[^.]+$/, "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    // Multi upload: lưu File[] vào image_url
    if (files.length > 1) {
      setFormData({ image_url: files, title: "", slug: "" });
      setPreview(URL.createObjectURL(files[0]));
      return;
    }

    const file = files[0];
    const titleFromFile = fileNameToTitle(file.name);
    const slug = toSlug(titleFromFile);

    // Single upload: set title mặc định theo filename nếu user chưa nhập
    setFormData({
      image_url: file,
      title: formData.title || titleFromFile,
      slug: formData.slug || slug,
    });
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addOrUpdatePhoto();
  };

  const multiFiles =
    !editingPhoto && Array.isArray(formData.image_url)
      ? formData.image_url
      : null;
  const isMultiUpload = !!multiFiles && multiFiles.length > 1;

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="p-6 space-y-4 overflow-y-auto scrollbar-hide"
      >
        {/* Tên ảnh */}
        {!isMultiUpload && (
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
        )}

        {/* Slug */}
        {!isMultiUpload && (
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
        )}

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
            onChange={(e) =>
              setFormData({ status: e.target.value as PhotoStatus })
            }
            className="w-full border rounded px-3 py-2"
          >
            <option value="public">Công khai</option>
            <option value="private">Riêng tư</option>
            <option value="draft">Nháp</option>
            <option value="archived">Lưu trữ</option>
          </select>
        </div>

        {/* Album Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Album
          </label>
          <div className="flex gap-2">
            <select
              value={formData.album_id ?? ""}
              onChange={(e) =>
                setFormData({
                  album_id: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="flex-1 border rounded px-3 py-2"
            >
              <option value="">-- Chọn album --</option>
              {albums.map((album) => (
                <option key={album.id} value={album.id}>
                  {album.title}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowNewAlbumForm(true)}
              className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-1"
              title="Tạo album mới"
            >
              <Plus className="w-4 h-4" />
              New
            </button>
          </div>
        </div>

        {/* Upload file */}
        <div className="max-w-md mx-auto rounded-lg overflow-hidden md:max-w-xl">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chọn ảnh upload (Tối đa 10MB, có thể upload nhiều ảnh)
          </label>
          {isMultiUpload && (
            <p className="text-xs text-gray-500 mb-2">
              Bạn đang upload {multiFiles?.length ?? 0} ảnh. Hệ thống sẽ tự dùng{" "}
              <b>tên file</b> làm tên ảnh cho từng ảnh.
            </p>
          )}
          <div className="md:flex">
            <div className="w-full">
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
                    <p className="text-gray-500">
                      Kéo thả hoặc click để upload
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  multiple={!editingPhoto}
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
      {isUploading && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white px-6 py-4 rounded-lg flex items-center gap-3">
            <LoaderInline size={20} />
            <span className="font-medium">Đang upload ảnh...</span>
          </div>
        </div>
      )}

      {/* Modal: Create New Album */}
      {showNewAlbumForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-9999">
          <div className="bg-white h-screen rounded-xl shadow-2xl w-full max-w-md mx-4 py-2 overflow-y-auto scrollbar-hide">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Tạo Album Mới</h2>
              <button
                onClick={() => setShowNewAlbumForm(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-6 h-6 cursor-pointer" />
              </button>
            </div>
            <AlbumForm
              onClose={() => setShowNewAlbumForm(false)}
              onAlbumCreated={(albumId) => {
                // Auto-select the created album
                setFormData({ album_id: albumId });
                setShowNewAlbumForm(false);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
