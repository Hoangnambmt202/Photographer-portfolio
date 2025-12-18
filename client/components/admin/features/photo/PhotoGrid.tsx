"use client";

import type { Photo } from "@/types";
import PhotoCard from "./PhotoCard";

interface PhotoGridProps {
  photos: Photo[];
  onDelete: (id: number) => void;
}

export default function PhotoGrid({ photos, onDelete }: PhotoGridProps) {
  if (!photos.length)
    return <div className="text-center py-12 text-gray-500">Không có ảnh</div>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {photos.map((photo) => (
        <PhotoCard key={photo.id} photo={photo} onDelete={onDelete} />
      ))}
    </div>
  );
}

