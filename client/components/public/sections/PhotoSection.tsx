import { useInView } from "framer-motion";
import { useRef } from "react";
import {motion} from "framer-motion";
import { Alex_Brush } from "next/font/google";

const alex_brush_font = Alex_Brush({
  weight: "400",
  subsets: ['vietnamese'],
})

const PhotoGridItem = ({ src, alt, className, index }:{src:string, alt:string, className:string, index:number}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className={`group relative overflow-hidden rounded-lg shadow-xl ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.25, 0.4, 0.25, 1]
      }}
      whileHover={{ scale: 1.02 }}
    >
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />
      <motion.div 
        className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
    </motion.div>
  );
};

// Photos Section Component
const PhotoSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const photos = [
    { src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80", alt: "Photo 1", className: "col-span-12 md:col-span-8 row-span-2" },
    { src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80", alt: "Photo 2", className: "col-span-6 md:col-span-4 row-span-2" },
    { src: "https://images.unsplash.com/photo-1606216794079-e48e879d0d70?w=600&q=80", alt: "Photo 3", className: "col-span-6 md:col-span-3" },
    { src: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&q=80", alt: "Photo 4", className: "col-span-6 md:col-span-5" },
    { src: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=800&q=80", alt: "Photo 5", className: "col-span-12 md:col-span-4" },
    { src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80", alt: "Photo 6", className: "col-span-6 md:col-span-4 row-span-2" },
    { src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80", alt: "Photo 7", className: "col-span-6 md:col-span-4" },
    { src: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80", alt: "Photo 8", className: "col-span-12 md:col-span-4" },
  ];

  return (
    <section ref={ref} id="photos" className="min-h-screen bg-white py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-6xl font-light text-black mb-4 tracking-tight">
            Những bức ảnh của tôi
          </h2>
          <motion.div 
            className="w-20 h-1 bg-black mx-auto mb-6"
            initial={{ width: 0 }}
            animate={isInView ? { width: 80 } : { width: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
          <motion.p 
            className="text-xl text-gray-600 font-light"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Ảnh không chỉ là ảnh, mà còn là nơi lưu giữ những khoảnh khắc vô giá!
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-12 gap-4 auto-rows-[200px]">
          {photos.map((img, index) => (
            <PhotoGridItem
              key={index}
              src={img.src}
              alt={img.alt}
              className={img.className}
              index={index}
            />
          ))}
          
          <motion.div 
            className="col-span-12 md:col-span-8 md:row-span-1 flex items-center justify-center p-6"
            initial={{ opacity: 0, rotate: -5 }}
            animate={isInView ? { opacity: 1, rotate: 0 } : { opacity: 0, rotate: -5 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <p className={`"text-4xl md:text-5xl lg:text-6xl leading-relaxed text-right  text-gray-800" ${alex_brush_font.className}`}>
              Hãy để tôi ghi lại <br /> những khoảnh khắc đẹp nhất của bạn
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PhotoSection