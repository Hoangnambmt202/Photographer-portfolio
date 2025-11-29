"use client";
import Image from "next/image";
import { Eye, Download, Trash2 } from "lucide-react";
import type { Photo } from "@/stores/photoStore";

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
        <div
          key={photo.id}
          className="bg-white rounded-lg shadow-lg overflow-hidden group hover:scale-105 transform transition-all duration-300"
        >
          <div className="relative h-48 w-full bg-gray-200 overflow-hidden">
            <Image
              src={photo.image_url || "/placeholder.png"}
              alt={photo.title}
              width={300}
              height={300}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                <button className="p-2 bg-white rounded-full shadow hover:scale-110 transform transition">
                  <Eye className="w-5 h-5" />
                </button>
                <button className="p-2 bg-white rounded-full shadow hover:scale-110 transform transition">
                  <Download className="w-5 h-5" />
                </button>
                <button
                  className="p-2 bg-white rounded-full shadow text-red-600 hover:scale-110 transform transition"
                  onClick={() => onDelete(photo.id)}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          <div className="p-2 text-center">
            <p className="font-medium text-sm truncate">{photo.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
