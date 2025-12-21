"use client";

import type { Photo } from "@/types";
import PhotoCard from "./PhotoCard";
import { useState } from "react";
import PhotoDetailModal from "./PhotoDetailModal";

interface PhotoGridProps {
  photos: Photo[];
  onDelete: (id: number) => void;
}

export default function PhotoGrid({ photos, onDelete }: PhotoGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!photos.length) {
    return <div className="text-center py-12 text-gray-500">Không có ảnh</div>;
  }

  const selectedPhoto = selectedIndex !== null ? photos[selectedIndex] : null;

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {photos.map((photo, index) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            onDelete={onDelete}
            onView={() => setSelectedIndex(index)}
          />
        ))}
      </div>

      {/* Modal (CHỈ 1 CÁI DUY NHẤT) */}
      <PhotoDetailModal
        photo={selectedPhoto}
        open={selectedIndex !== null}
        onClose={() => setSelectedIndex(null)}
        onPrev={() => setSelectedIndex((i) => (i! > 0 ? i! - 1 : i))}
        onNext={() =>
          setSelectedIndex((i) => (i! < photos.length - 1 ? i! + 1 : i))
        }
        hasPrev={selectedIndex !== null && selectedIndex > 0}
        hasNext={selectedIndex !== null && selectedIndex < photos.length - 1}
      />
    </>
  );
}
