"use client";
import { motion } from "framer-motion";

interface LoaderBlockProps {
  label?: string;
  height?: number;
}

export default function LoaderBlock({ label = "Đang tải...", height = 200 }: LoaderBlockProps) {
  return (
    <div
      className="flex flex-col items-center justify-center text-gray-600 bg-gray-50 rounded-xl"
      style={{ height }}
    >
      <motion.div
        className="border-4 border-gray-300 border-t-blue-500 rounded-full"
        style={{ width: 40, height: 40 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      />
      {label && <p className="mt-3 text-sm">{label}</p>}
    </div>
  );
}
