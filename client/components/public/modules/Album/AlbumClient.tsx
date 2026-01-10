/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import LoaderInline from "@/components/common/LoaderInline";
import AlbumCard from "./AlbumCard";
import { useAlbumsInfinite } from "@/hooks/useAlbumsInfinite";
import { motion } from "framer-motion";

export default function AlbumsClient({
  initialAlbums,
}: {
  initialAlbums: any[];
}) {
  const {
    albums,
    loadMore,
    isLoadingMore,
    isReachingEnd,
  } = useAlbumsInfinite(initialAlbums);

  return (
    <section
      id="albums"
      className="min-h-screen bg-[#f5f5f5] py-20 px-4 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-5">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Gallery</h2>
            <p className="text-gray-500">Cuộn xuống để khám phá thêm</p>
        </div>

        {/* Grid Container */}
        {/* gap-y-10: Khoảng cách dọc nhỏ thôi vì card có margin âm trong logic motion */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3 pb-20">
          {albums.map((album, index) => {
             // Tạo màu Gradient ngẫu nhiên đẹp mắt
             const hueA = (340 + index * 50) % 360; 
             const hueB = (hueA + 40) % 360;

             return (
                <AlbumCard
                  key={`${album.id}-${index}`}
                  index={index}
                  title={album.title}
                  count={album.photo_quantity}
                  coverImage={album.cover_image}
                  hueA={hueA}
                  hueB={hueB}
                />
             );
          })}
        </div>

        {/* Load More Button */}
        {!isReachingEnd && (
          <div className="flex justify-center mt-10 relative z-20">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadMore}
              disabled={isLoadingMore}
              className="px-8 py-3 rounded-full bg-black text-white font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {isLoadingMore ? <LoaderInline/> : "Load More Albums"}
            </motion.button>
          </div>
        )}

        {isReachingEnd && (
           <div className="text-center pb-10 text-gray-400">
             <p>Đón chờ các concept tiếp theo nữa nhé ! 🎉</p>
           </div>
        )}
      </div>
    </section>
  );
}