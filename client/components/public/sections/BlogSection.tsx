'use client'
import { useInView } from "framer-motion";
import { useRef } from "react";
import {motion} from "framer-motion";

const BlogSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const blogPosts = [
    { title: "Bí quyết chụp ảnh cưới đẹp", date: "15/11/2025", image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80" },
    { title: "Ánh sáng trong nhiếp ảnh", date: "10/11/2025", image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&q=80" },
    { title: "Trang thiết bị cho người mới", date: "5/11/2025", image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&q=80" },
  ];

  return (
    <section ref={ref} id="blog" className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-6xl font-light text-black mb-4 tracking-tight">Blog</h2>
          <motion.div 
            className="w-20 h-1 bg-black mx-auto mb-6"
            initial={{ width: 0 }}
            animate={isInView ? { width: 80 } : { width: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
          <p className="text-xl text-gray-600 font-light">
            Chia sẻ kinh nghiệm và câu chuyện nhiếp ảnh
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-lg cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <div className="relative h-64 overflow-hidden">
                <motion.img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                />
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-500 mb-2">{post.date}</p>
                <h3 className="text-2xl font-light text-gray-900">{post.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection