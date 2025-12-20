"use client";

import Image from "next/image";
import { X, Calendar, FolderOpen, FileText, CheckCircle2, Download, ChevronRight, ChevronLeft } from "lucide-react";
import { Photo } from "@/types";
import { formatDateTime } from "@/utils/date";

interface PhotoDetailModalProps {
  photo: Photo | null;
  open: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export default function PhotoDetailModal({
  photo,
  open,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: PhotoDetailModalProps) {
  if (!open || !photo) return null;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "public":
        return "bg-green-100 text-green-700 border-green-200";
      case "draft":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "private":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };
  const handleDownload = async () => {
    if (!photo.image_url) return;

    const res = await fetch(photo.image_url);
    const blob = await res.blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = photo.title || "photo";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/15 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-xl w-full max-w-3xl mx-4 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow hover:scale-110 transition"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Download */}
        <button
          onClick={handleDownload}
          className="absolute top-3 left-3 z-20 p-2 bg-white rounded-full shadow hover:scale-110 transition"
          title="Download"
        >
          <Download className="w-4 h-4" />
        </button>
        {/* Image */}
        <div className="bg-gray-100 flex items-center justify-center">
          <Image
            src={photo.image_url || "/placeholder.png"}
            alt={photo.title}
            width={1200}
            height={800}
            className="object-contain max-h-[50vh] w-full "
            priority
          />
          {/* Prev */}
        {hasPrev && (
            <button
              onClick={onPrev}
              className="absolute left-3 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow hover:scale-110 transition"
              title="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Next */}
          {hasNext && (
            <button
              onClick={onNext}
              className="absolute right-3 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow hover:scale-110 transition"
               title="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
        
        

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Title */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {photo.title}
            </h2>
            <div className="h-0.5 w-10 bg-linear-to-r from-blue-500 to-purple-500 rounded-full mt-1" />
          </div>

          {/* Description */}
          <div className="flex gap-2 text-sm bg-gray-50 p-3 rounded-lg">
            <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <span className="font-medium text-gray-500">Mô tả: </span>
              <span className="text-gray-900">
                {photo.description || (
                  <span className="italic text-gray-400">Chưa có mô tả</span>
                )}
              </span>
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {/* Created */}
            <div className="flex items-center gap-2 p-2.5 bg-blue-50 rounded-lg border border-blue-100">
              <Calendar className="w-4 h-4 text-blue-600" />
              <div>
                <div className="text-gray-500 text-xs">Ngày tạo</div>
                <div className="font-semibold text-gray-900">
                  {photo.created_at ? formatDateTime(photo.created_at) : "N/A"}
                </div>
              </div>
            </div>

            {/* Album */}
            <div className="flex items-center gap-2 p-2.5 bg-purple-50 rounded-lg border border-purple-100">
              <FolderOpen className="w-4 h-4 text-purple-600" />
              <div>
                <div className="text-gray-500 text-xs">Album</div>
                <div className="font-semibold text-gray-900">
                  {photo.album?.title || (
                    <span className="italic text-gray-400">Chưa có album</span>
                  )}
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 p-2.5 bg-green-50 rounded-lg border border-green-100">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <div>
                <div className="text-gray-500 text-xs">Trạng thái</div>
                <span
                  className={`inline-block mt-0.5 px-2 py-0.5 text-xs font-semibold rounded-full border ${getStatusColor(
                    photo.status
                  )}`}
                >
                  {photo.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
