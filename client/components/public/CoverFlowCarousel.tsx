/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { motion, useMotionValue, PanInfo } from "framer-motion";
import Image from "next/image";

const CoverFlowCarousel = ({ data }: { data: any[] }) => {
  console.log(data);
  const images = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&h=600&fit=crop",
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1541849546-216549ae216d?w=800&h=600&fit=crop",
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1579869847557-1f67382cc158?w=800&h=600&fit=crop",
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop",
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop",
    },
    {
      id: 6,
      url: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&h=600&fit=crop",
    },
    {
      id: 7,
      url: "https://images.unsplash.com/photo-1541480551145-2370a440d585?w=800&h=600&fit=crop",
    },
    {
      id: 8,
      url: "https://images.unsplash.com/photo-1516496636080-14fb876e029d?w=800&h=600&fit=crop",
    },
    {
      id: 9,
      url: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=800&h=600&fit=crop",
    },
    {
      id: 10,
      url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop",
    },
    {
      id: 11,
      url: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800&h=600&fit=crop",
    },
    {
      id: 12,
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    },
    {
      id: 13,
      url: "https://images.unsplash.com/photo-1754993313857-d7e6370c24bf?w=800&h=600&fit=crop",
    },
    {
      id: 14,
      url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
    },
    {
      id: 15,
      url: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&h=600&fit=crop",
    },
  ];

  const initialIndex = data?.length ? Math.floor(data.length / 2) : 0;

  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const dragX = useMotionValue(0);
  const [windowWidth, setWindowWidth] = useState(0);

  // Lấy chiều rộng cửa sổ trên client
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize(); // set lúc mount

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = 25;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    if ((offset > threshold || velocity > 400) && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (
      (offset < -threshold || velocity < -400) &&
      currentIndex < images.length - 1
    ) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleImageClick = (index: number) => {
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  // Hàm tính translateX dựa trên width
  const getTranslateX = (offset: number) => {
    if (windowWidth < 640) return offset * 120;
    if (windowWidth < 1024) return offset * 160;
    return offset * 220;
  };

  return (
    <div className="min-h-screen relative bg-white  flex flex-col md:flex-row items-center justify-center overflow-hidden p-4 md:p-8">
      <div className="absolute inset-0 blur-sm">
        <Image
          src="https://images.unsplash.com/photo-1496602910407-bacda74a0fe4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y291cGxlfGVufDB8fDB8fHwy"
          alt="image"
          fill
        />
      </div>
      <div className="text-center mb-16 block z-10">
        <h1 className="text-5xl font-bold text-gray-700 mb-4">
          Những khoảnh khắc đáng nhớ
        </h1>
        <p className="text-gray-600 text-lg">
          Kéo để khám phá bộ sưu tập ảnh của tôi
        </p>
      </div>

      {/* Carousel Container */}
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center perspective-1000 ">
        {/* Heading */}

        {/* Left Blur */}
        <div className="absolute left-0 md:left-0 top-0 bottom-0 w-24 sm:w-48 md:w-58  z-20 pointer-events-none" />
        {/* Right Blur */}
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-48 md:w-58  z-20 pointer-events-none" />

        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          dragTransition={{ bounceStiffness: 800, bounceDamping: 30 }}
          onDragEnd={onDragEnd}
          style={{ x: dragX }}
          className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
        >
          {data.map((image: any, index: number) => {
            const offset = index - currentIndex;
            const absOffset = Math.abs(offset);

            const rotateY = offset * 40;
            const translateX = getTranslateX(offset); // dùng hàm safe
            const translateZ = -absOffset * 250;
            const scale = 1 - absOffset * 0.22;
            const opacity = absOffset < 3 ? 1 - absOffset * 0.3 : 0;
            const blur = absOffset > 0 ? Math.min(absOffset * 4, 12) : 0;
            const zIndex = data.length - absOffset || images.length - absOffset;

            return (
              <motion.div
                key={image.id}
                onClick={() => handleImageClick(index)}
                className="absolute"
                style={{ zIndex }}
                animate={{
                  rotateY,
                  x: translateX,
                  z: translateZ,
                  scale,
                  opacity,
                  filter: `blur(${blur}px)`,
                }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 35,
                  mass: 0.4,
                }}
              >
                <div
                  className={`relative w-48 h-64 sm:w-64 sm:h-80 md:w-80 md:h-96 lg:w-96 lg:h-112 rounded-xl md:rounded-2xl overflow-hidden shadow-2xl transform-gpu ${
                    offset === 0 ? "cursor-default" : "cursor-pointer"
                  }`}
                  style={{
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                  }}
                >
                  <Image
                    src={image.image_url || image.url}
                    alt={image.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className=" object-cover cursor-grab"
                    draggable={false}
                  />
                  {offset !== 0 && (
                    <div className="absolute inset-0 bg-black/20" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1200px;
        }
      `}</style>
    </div>
  );
};

export default CoverFlowCarousel;
