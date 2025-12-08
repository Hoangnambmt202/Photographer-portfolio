'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useAlbumStore } from '@/stores/albumStore';
import { usePhotoStore } from '@/stores/photoStore';
import { Photo } from '@/types';
import { ArrowLeft } from 'lucide-react';
import SortablePhotoItem from '@/components/admin/features/album/SortablePhotoItem';
import LoaderBlock from '@/components/common/LoaderBlock';
import LoaderInline from '@/components/common/LoaderInline';

export default function AlbumDetailPage() {
  const params = useParams();
  const router = useRouter();
  const albumId = Number(params?.id);

  const { albums } = useAlbumStore();
  const { albumPhotos, fetchAlbumPhotos, reorderPhotos, setFeatured, isLoading } = usePhotoStore();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [album, setAlbum] = useState<any>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isReordering, setIsReordering] = useState(false);

  // Drag & drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load album & photos
  useEffect(() => {
    if (!albumId) return;

    // Find album from store
    const foundAlbum = albums.find((a) => a.id === albumId);
    setAlbum(foundAlbum);

    // Fetch album photos
    fetchAlbumPhotos(albumId);
  }, [albumId, albums, fetchAlbumPhotos]);

  // Update local photos when albumPhotos changes
  useEffect(() => {
    setPhotos(albumPhotos);
  }, [albumPhotos]);

  // Handle drag end
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = photos.findIndex((p) => p.id === active.id);
    const newIndex = photos.findIndex((p) => p.id === over.id);

    const newPhotos = arrayMove(photos, oldIndex, newIndex);
    setPhotos(newPhotos);

    // Send to backend
    try {
      setIsReordering(true);
      const reorderData = newPhotos.map((p, idx) => ({
        id: p.id,
        order: idx,
      }));
      await reorderPhotos(albumId, reorderData);
    } finally {
      setIsReordering(false);
    }
  };

  // Handle set featured
  const handleSetFeatured = async (photoId: number) => {
    try {
      await setFeatured(photoId, albumId);
    } catch (error) {
      console.error(error);
    }
  };

  if (!album) {
    return (
      <div className="space-y-6">
        <LoaderBlock height={300} label="Đang tải album..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
          title="Quay lại"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
         {/* Album Info */}
      {album && (
        <div className="bg-blue-100 border border-blue-200 rounded-lg p-4 flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Album <span className='text-blue-900'>{album.title}</span> </h1>
          <p className="text-gray-900">Mô tả: <span className='text-blue-900'> {album.description}</span></p>
        </div>
      )}
        
      </div>
<div>
          
          <p className="text-gray-500 mt-1">
            {album.featured_photo_id && ` • Featured: Photo #${album.featured_photo_id}`}
          </p>
        </div>
     

      {/* Photos Grid with Drag & Drop */}
      {isLoading ? (
        <LoaderBlock height={400} label="Đang tải ảnh..." />
      ) : photos.length === 0 ? (
        <div className="text-center py-12 text-gray-500 border border-dashed border-gray-300 rounded-lg">
          <p>Không có ảnh trong album này</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className='flex justify-between items-center'>
            <h2 className='text-lg font-semibold text-gray-900 mb-4'>Số lượng: {photos.length} ảnh</h2>
            <h2 className="text- text-gray-400 mb-4">
              Sắp xếp ảnh (Kéo để thay đổi vị trí)
            </h2>
            

          </div>

          {isReordering && (
            <div className="mb-4 flex items-center gap-2 text-blue-600 bg-blue-50 p-3 rounded-lg">
              <LoaderInline/>
              <span>Đang lưu...</span>
            </div>
          )}

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={photos.map((p) => p.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {photos.map((photo) => (
                  <SortablePhotoItem
                    key={photo.id}
                    photo={photo}
                    isFeatured={album.featured_photo_id === photo.id}
                    onSetFeatured={() => handleSetFeatured(photo.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
}
