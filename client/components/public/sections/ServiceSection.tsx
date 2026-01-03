/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Users, Tag, DollarSign, CheckCircle } from "lucide-react";
import Image from "next/image";
import { Service } from "@/types";
import { useState } from "react";

const ServicesSection = ({ data }: { data: Service[] }) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const calculateDiscountedPrice = (price: number, discount: number) => {
    return price - (price * discount) / 100;
  };

  return (
    <section
      id="services"
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-light text-white mb-4 tracking-tight">
            Dịch vụ chụp ảnh
          </h2>

          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Khám phá các gói dịch vụ chụp ảnh chuyên nghiệp của chúng tôi
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {data.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group cursor-pointer"
              onClick={() => setSelectedService(service)}
            >
              <div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl">
                {/* Image */}
                <Image
                  src={
                    service.cover_image ||
                    "https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg?semt=ais_hybrid&w=740&q=80"
                  }
                  alt={service.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

                {/* Featured badge */}
                {service.is_featured && (
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                    className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg"
                  >
                    Nổi bật
                  </motion.div>
                )}

                {/* Discount badge */}
                {service.discount_percent > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1, type: "spring" }}
                    className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg"
                  >
                    -{service.discount_percent}%
                  </motion.div>
                )}

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-semibold mb-2 group-hover:text-amber-400 transition-colors">
                    {service.name}
                  </h3>

                  <div className="flex items-baseline gap-2 mb-3">
                    {service.discount_percent > 0 ? (
                      <>
                        <span className="text-2xl font-bold text-amber-400">
                          {formatPrice(
                            calculateDiscountedPrice(
                              service.price,
                              service.discount_percent
                            )
                          )}
                        </span>
                        <span className="text-sm line-through text-slate-400">
                          {formatPrice(service.price)}
                        </span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold text-amber-400">
                        {formatPrice(service.price)}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {service.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag.id}
                        className="text-xs px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>

                  <div className="text-sm text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Nhấn để xem chi tiết →
                  </div>
                </div>

                {/* Hover effect border */}
                <div className="absolute inset-0 border-2 border-amber-400 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal chi tiết dịch vụ */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0  bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 "
            onClick={() => setSelectedService(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl scrollbar-hide"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 z-10 bg-slate-900/80 hover:bg-slate-900 p-2 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              {/* Image header */}
              <div className="relative h-64 md:h-96 rounded-t-3xl overflow-hidden">
                <Image
                  src={
                    selectedService.cover_image ||
                    "https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg?semt=ais_hybrid&w=740&q=80"
                  }
                  alt={selectedService.name}
                  fill
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-800 via-transparent to-transparent"></div>

                {selectedService.discount_percent > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Giảm {selectedService.discount_percent}%
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {selectedService.name}
                </h3>

                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedService.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>

                <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                  {selectedService.description}
                </p>

                {/* Price section */}
                <div className="bg-slate-900/50 rounded-2xl p-6 mb-6">
                  <div className="flex items-baseline gap-3 mb-2">
                    <DollarSign className="w-6 h-6 text-amber-400" />
                    <span className="text-slate-400 text-sm">Giá dịch vụ</span>
                  </div>
                  <div className="flex items-baseline gap-3">
                    {selectedService.discount_percent > 0 ? (
                      <>
                        <span className="text-3xl md:text-4xl font-bold text-amber-400">
                          {formatPrice(
                            calculateDiscountedPrice(
                              selectedService.price,
                              selectedService.discount_percent
                            )
                          )}
                        </span>
                        <span className="text-xl line-through text-slate-500">
                          {formatPrice(selectedService.price)}
                        </span>
                      </>
                    ) : (
                      <span className="text-3xl md:text-4xl font-bold text-amber-400">
                        {formatPrice(selectedService.price)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  <div className="bg-slate-900/50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="w-5 h-5 text-amber-400" />
                      <span className="text-slate-400 text-sm">Thời lượng</span>
                    </div>
                    <p className="text-white text-lg font-semibold">
                      {selectedService.duration} giờ
                    </p>
                  </div>

                  {selectedService.max_people && (
                    <div className="bg-slate-900/50 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Users className="w-5 h-5 text-amber-400" />
                        <span className="text-slate-400 text-sm">Số người</span>
                      </div>
                      <p className="text-white text-lg font-semibold">
                        Tối đa {selectedService.max_people} người
                      </p>
                    </div>
                  )}
                </div>

                {/* Included items */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Tag className="w-6 h-6 text-amber-400" />
                    <h4 className="text-white text-xl font-semibold">
                      Bao gồm trong gói
                    </h4>
                  </div>
                  <div className="space-y-3">
                    {selectedService.included_items
                      .split(",")
                      .map((item: string, i: number) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-300">{item.trim()}</span>
                        </motion.div>
                      ))}
                  </div>
                </div>

                {/* CTA buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-4 rounded-xl shadow-lg transition-all"
                  >
                    Đặt lịch ngay
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-4 rounded-xl transition-all"
                  >
                    Tư vấn thêm
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ServicesSection;
