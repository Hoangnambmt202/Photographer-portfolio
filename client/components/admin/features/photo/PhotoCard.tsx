// PhotoCard.tsx
import Image from "next/image";
import { Eye, Download, Trash2 } from "lucide-react";
import  { Photo } from "@/types";
import Link from "next/link";
interface PhotoCardProps {
  photo: Photo;
  onDelete: (id: number) => void;
  onView?: (photo: Photo) => void;
  onDownload?: (photo: Photo) => void;
}

export default function PhotoCard({ photo, onDelete, onView, onDownload }: PhotoCardProps) {
  return (
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
            
            {/* Nút VIEW (Chưa triển khai logic onView) */}
            <button 
              className="p-2 bg-white rounded-full shadow hover:scale-110 transform transition"
              onClick={() => onView && onView(photo)}
            >
              <Eye className="w-5 h-5" />
            </button>
            
            {/* Nút DOWNLOAD (Chưa triển khai logic onDownload) */}
            <button 
              className="p-2 bg-white rounded-full shadow hover:scale-110 transform transition"
              onClick={() => onDownload && onDownload(photo)}
            >
              <Download className="w-5 h-5" />
            </button>
            
            {/* Nút DELETE */}
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
  );
}