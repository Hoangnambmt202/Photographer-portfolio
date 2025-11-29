"use client";

import type { Photo } from "@/stores/photoStore";
import PhotoCard from "./PhotoCard";

interface PhotoGridProps {
  photos: Photo[];
  onDelete: (id: number) => void;
  searchTerm: string;
}

export default function PhotoGrid({ photos, onDelete, searchTerm }: PhotoGridProps) {
  const filtered = photos.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filtered.length === 0)
    return (
      <div className="text-center py-12 text-gray-500">
        Không tìm thấy ảnh
      </div>
    );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {filtered.map((photo) => (
       <PhotoCard
          key={photo.id}
          photo={photo}
          onDelete={onDelete}
          // Thêm các prop khác (onView, onDownload) nếu cần
        />
      ))}
    </div>
  );
}
