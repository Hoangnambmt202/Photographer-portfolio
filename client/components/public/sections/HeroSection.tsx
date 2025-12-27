'use client'

import { useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {motion} from "framer-motion"
import Image from "next/image";
const HeroSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section ref={ref} id="home" className="h-screen relative overflow-hidden">
      <motion.div 
        className="absolute inset-0"
        style={{ y }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-700">
          <Image
            width={100}
            height={100}
            src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1920&q=80" 
            alt="Hero" 
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        <div className="absolute inset-0 bg-black/30"></div>
      </motion.div>
      
      <motion.div 
        className="relative h-full flex items-center justify-center text-center px-6"
        style={{ opacity }}
      >
        <div className="max-w-4xl">
          <motion.h1 
            className="text-6xl md:text-8xl font-light text-white mb-6 tracking-tight leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            Capturing Life&apos;s
            <br />
            <motion.span 
              className="italic font-serif"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            >
              Beautiful Moments
            </motion.span>
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-white/80 font-light tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            Nghệ thuật nhiếp ảnh chuyên nghiệp
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
};
export default HeroSection