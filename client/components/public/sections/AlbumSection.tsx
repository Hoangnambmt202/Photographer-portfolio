import { useInView, motion } from "framer-motion";
import { useRef, useState } from "react";

const AlbumCard = ({ title, count, coverImage, index }:{title:string, count:number, coverImage:string, index:number}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      className="group relative overflow-hidden rounded-2xl shadow-xl cursor-pointer"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.15,
        ease: [0.25, 0.4, 0.25, 1]
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative h-80 overflow-hidden bg-gray-900">
        <motion.img
          src={coverImage}
          alt={title}
          className="w-full h-full object-cover"
          animate={{
            scale: isHovered ? 1.1 : 1,
            y: isHovered ? -20 : 0
          }}
          transition={{ 
            duration: 0.6,
            ease: [0.34, 1.56, 0.64, 1]
          }}
        />
        
        {/* Dark overlay */}
        <motion.div 
          className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent"
          animate={{
            opacity: isHovered ? 1 : 0.6
          }}
          transition={{ duration: 0.4 }}
        />
      </div>
      
      {/* Content */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 p-6 text-white"
        initial={{ y: 20, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
        transition={{ delay: index * 0.15 + 0.3 }}
      >
        <motion.h3 
          className="text-2xl font-light mb-2"
          animate={{
            y: isHovered ? -10 : 0
          }}
          transition={{ duration: 0.4 }}
        >
          {title}
        </motion.h3>
        <motion.p 
          className="text-sm text-white/80"
          animate={{
            y: isHovered ? -10 : 0,
            opacity: isHovered ? 1 : 0.8
          }}
          transition={{ duration: 0.4 }}
        >
          {count} ảnh
        </motion.p>
      </motion.div>

      {/* Count badge */}
      <motion.div
        className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-sm font-medium"
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : { scale: 0 }}
        transition={{ delay: index * 0.15 + 0.5, type: "spring", stiffness: 200 }}
      >
        {count}
      </motion.div>

      {/* Hover effect border */}
      <motion.div
        className="absolute inset-0 border-2 border-white rounded-2xl pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.3 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

const AlbumsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const albums = [
    { title: "Đám cưới", count: 234, coverImage: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80" },
    { title: "Gia đình", count: 156, coverImage: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80" },
    { title: "Chân dung", count: 189, coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80" },
    { title: "Sự kiện", count: 98, coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80" },
    { title: "Phong cảnh", count: 142, coverImage: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80" },
    { title: "Thương mại", count: 76, coverImage: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80" },
  ];

  return (
    <section ref={ref} id="albums" className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-6xl font-light text-black mb-4 tracking-tight">
            Album của tôi
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
            Khám phá các Concept ảnh của chúng tôi
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {albums.map((album, index) => (
            <AlbumCard
              key={index}
              title={album.title}
              count={album.count}
              coverImage={album.coverImage}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AlbumsSection;