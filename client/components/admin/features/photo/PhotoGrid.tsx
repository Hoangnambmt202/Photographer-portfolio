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
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [open, setOpen] = useState(false);
  if (!photos.length)
    return <div className="text-center py-12 text-gray-500">Không có ảnh</div>;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {photos.map((photo) => (
        <>
        <PhotoCard key={photo.id} photo={photo} onDelete={onDelete} onView={(p) => {
          setSelectedPhoto(p);
          setOpen(true);
        }} />
        <PhotoDetailModal
        photo={selectedPhoto}
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedPhoto(null);
        }}
      />
        </>
      ))}
    </div>
  );
}

