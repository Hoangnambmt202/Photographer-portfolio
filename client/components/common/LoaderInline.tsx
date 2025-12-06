"use client";
import { motion } from "framer-motion";

interface LoaderInlineProps {
  size?: number;
  className?: string;
}

export default function LoaderInline({ size = 18, className }: LoaderInlineProps) {
  return (
    <motion.div
      className={`inline-block border-2 border-gray-300 border-t-blue-500 rounded-full ${className}`}
      style={{ width: size, height: size }}
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,
        ease: "linear",
        duration: 0.6,
      }}
    />
  );
}
    