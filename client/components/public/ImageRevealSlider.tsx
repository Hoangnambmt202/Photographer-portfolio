import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate , PanInfo } from 'framer-motion';
import { MoveHorizontal } from 'lucide-react';
import Image from 'next/image';

const ImageRevealSlider = () => {
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sliderPosition = useMotionValue(50);
  
  // Ảnh demo - thay thế bằng ảnh của bạn
  const beforeImage = "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&h=600&fit=crop";
  const afterImage = "https://images.unsplash.com/photo-1682687221038-404cb8830901?w=800&h=600&fit=crop";

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const offsetX = info.point.x - containerRect.left;
    
    // Tính phần trăm với giới hạn 0-100
    const percentage = Math.max(0, Math.min(100, (offsetX / containerWidth) * 100));
    sliderPosition.set(percentage);
  };

  const clipPath = useTransform(
    sliderPosition,
    (value) => `inset(0 ${100 - value}% 0 0)`
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center  py-24 px-6">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Dịch vụ hậu kỳ ảnh chuyên nghiệp
          </h1>
          <p className="text-gray-300 text-lg">
            Kéo thanh để xem sự khác biệt giữa hai ảnh
          </p>
        </motion.div>

        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative w-full aspect-4/3 rounded-2xl overflow-hidden shadow-2xl"
          onHoverStart={() => {
            if (!isDragging) {
              animate(sliderPosition, 60, { duration: 0.3, ease: "easeOut" });
            }
          }}
          onHoverEnd={() => {
            if (!isDragging) {
              animate(sliderPosition, 50, { duration: 0.3, ease: "easeOut" });
            }
          }}
        >
          {/* Ảnh After (nền) */}
          <div className="absolute inset-0">
            <Image
            width={100}
            height={100}
              src={afterImage}
              alt="After"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-white font-semibold">After</span>
            </div>
          </div>

          {/* Ảnh Before (với clip-path) */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ clipPath }}
          >
            <Image
            width={100}
            height={100}
              src={beforeImage}
              alt="Before"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-white font-semibold">Before</span>
            </div>
          </motion.div>

          {/* Thanh slider và nút kéo - di chuyển đồng bộ */}
          <motion.div
            className="absolute top-0 bottom-0 z-10"
            style={{
              left: useTransform(sliderPosition, (value) => `${value}%`),
            }}
            drag="x"
            dragConstraints={containerRef}
            dragElastic={0}
            dragMomentum={false}
            onDrag={handleDrag}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
          >
            {/* Thanh dọc - căn giữa chính xác */}
            <div className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl left-0 -translate-x-1/2">
              {/* Chấm trên */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full" />
              {/* Chấm dưới */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full" />
            </div>

            {/* Handle kéo - căn giữa với thanh */}
            <motion.div
              className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-2xl cursor-grab active:cursor-grabbing flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{
                  x: isDragging ? 0 : [-3, 3, -3],
                }}
                transition={{
                  repeat: isDragging ? 0 : Infinity,
                  duration: 1.5,
                  ease: "easeInOut"
                }}
              >
                <MoveHorizontal className="w-8 h-8 text-gray-800" />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Overlay linear khi hover */}
          <motion.div
            className="absolute inset-0 bg-linear-to-r from-gray-500/0 via-white/10 to-gray-500/0 pointer-events-none"
            animate={{
              opacity: isDragging ? 1 : 0
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        {/* Hướng dẫn sử dụng */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full text-white">
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              ←
            </motion.div>
            <span>Kéo thanh hoặc di chuột qua ảnh</span>
            <motion.div
              animate={{ x: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              →
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ImageRevealSlider;