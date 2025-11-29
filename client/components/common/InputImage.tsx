'use client'

import { useAlbumStore } from "@/stores/albumStore";
import Image from "next/image";
import { useEffect, useState } from "react";

const InputImage = () => {
  const { formData, setFormData } = useAlbumStore();
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    // Khi edit album, load ảnh cover từ DB
    if (formData.cover_image && typeof formData.cover_image === "string") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreview(formData.cover_image);
    }
  }, [formData.cover_image]);

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setFormData({ cover_image: file });

  setPreview(URL.createObjectURL(file));
};


  return (
    <div className="relative h-48 border-2 border-blue-500 rounded-lg bg-gray-50 flex items-center justify-center">
      {preview ? (
        <Image src={preview} alt="Preview" fill className="object-cover rounded-lg" />
      ) : (
        <div className="absolute text-center pointer-events-none">
          <Image src="https://img.icons8.com/dusk/64/000000/file.png" alt="icon" width={80} height={80} />
          <p className="text-gray-500">Kéo thả hoặc click để upload</p>
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        className="absolute inset-0 opacity-0 cursor-pointer"
        onChange={handleChange}
      />
    </div>
  );
};

export default InputImage;
