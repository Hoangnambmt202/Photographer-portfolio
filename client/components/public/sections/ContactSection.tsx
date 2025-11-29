import { useInView } from "framer-motion";
import { useRef } from "react";
import {motion} from "framer-motion";

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} id="contact" className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80" 
          alt="Contact" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-br from-black/70 to-black/50"></div>
      </div>
      
      <div className="relative py-24 px-6 flex items-center min-h-screen">
        <div className="max-w-4xl mx-auto text-center text-white w-full">
          <motion.h2 
            className="text-5xl md:text-6xl font-light mb-8 tracking-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
          >
            Liên hệ
          </motion.h2>
          <motion.div 
            className="w-20 h-1 bg-white mx-auto mb-12"
            initial={{ width: 0 }}
            animate={isInView ? { width: 80 } : { width: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
          
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.p 
              className="text-2xl font-light"
              whileHover={{ scale: 1.05 }}
            >
              📧 contact@photography.com
            </motion.p>
            <motion.p 
              className="text-2xl font-light"
              whileHover={{ scale: 1.05 }}
            >
              📱 +84 123 456 789
            </motion.p>
            <motion.p 
              className="text-2xl font-light"
              whileHover={{ scale: 1.05 }}
            >
              📍 Hà Nội, Việt Nam
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection