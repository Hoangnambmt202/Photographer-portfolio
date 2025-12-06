'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Photo } from '@/types';
import { Star, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface SortablePhotoItemProps {
  photo: Photo;
  isFeatured: boolean;
  onSetFeatured: (photoId: number) => void;
  onDelete?: (photoId: number) => void;
}

export default function SortablePhotoItem({
  photo,
  isFeatured,
  onSetFeatured,
  onDelete,
}: SortablePhotoItemProps) {
  const [isHovering, setIsHovering] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: photo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all cursor-grab active:cursor-grabbing ${
        isDragging ? 'ring-2 ring-blue-500' : ''
      }`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      {...attributes}
      {...listeners}
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-100">
        <Image
          src={photo.image_url || 'https://via.placeholder.com/300'}
          alt={photo.title || 'Untitled'}
          fill
          className="object-cover"
        />

        {/* Featured Badge */}
        {isFeatured && (
          <div className="absolute top-2 left-2 bg-yellow-500 rounded-full p-1">
            <Star className="w-4 h-4 text-white fill-white" />
          </div>
        )}

        {/* Overlay & Actions */}
        {isHovering && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2 transition-all">
            {/* Set Featured Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSetFeatured(photo.id);
              }}
              className={`p-2 rounded-lg transition ${
                isFeatured
                  ? 'bg-yellow-500 text-white'
                  : 'bg-white/20 text-white hover:bg-white/40'
              }`}
              title={isFeatured ? 'Bỏ chọn nổi bật' : 'Đặt nổi bật'}
            >
              <Star className="w-5 h-5" />
            </button>

            {/* Delete Button */}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Bạn chắc chắn muốn xóa ảnh này?')) {
                    onDelete(photo.id);
                  }
                }}
                className="p-2 bg-red-500/80 text-white rounded-lg hover:bg-red-600 transition"
                title="Xóa ảnh"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Photo Title */}
      <div className="p-2 bg-white border-t border-gray-200">
        <p className="text-xs font-medium text-gray-700 truncate">
          {photo.title || `Photo #${photo.id}`}
        </p>
        <p className="text-xs text-gray-500">Vị trí: {photo.order ?? 0}</p>
      </div>
    </div>
  );
}
