import { useInView } from "framer-motion";
import { useRef } from "react";
import {motion} from "framer-motion";

const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  const services = [
    { name: "Chụp ảnh cưới", icon: "💍" },
    { name: "Chân dung", icon: "👤" },
    { name: "Sự kiện", icon: "🎉" },
    { name: "Thương mại", icon: "💼" },
    { name: "Du lịch", icon: "✈️" }
  ];

  return (
    <section ref={ref} id="services" className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1920&q=80" 
          alt="Services" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      
      <div className="relative py-24 px-6 flex items-center min-h-screen">
        <div className="max-w-6xl mx-auto w-full">
          <motion.div 
            className="text-center text-white mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-light mb-8 tracking-tight">Dịch vụ</h2>
            <motion.div 
              className="w-20 h-1 bg-white mx-auto"
              initial={{ width: 0 }}
              animate={isInView ? { width: 80 } : { width: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-md p-8 rounded-2xl text-center border border-white/20"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1 + 0.5,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  transition: { duration: 0.3 }
                }}
              >
                <motion.div 
                  className="text-5xl mb-4"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {service.icon}
                </motion.div>
                <p className="text-white font-light text-lg">{service.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default ServicesSection