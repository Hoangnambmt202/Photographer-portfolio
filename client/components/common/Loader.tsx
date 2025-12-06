// components/common/Loader.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";

export type LoaderVariant = "ring" | "dots" | "bars";

export interface LoaderProps {
  variant?: LoaderVariant;
  size?: number; // pixel size (spinner diameter)
  thickness?: number; // for ring stroke width
  color?: string; // CSS color string (tailwind color, hex, rgb...)
  label?: string; // accessible label (visible if provided)
  fullscreen?: boolean; // show centered fullscreen overlay
  className?: string; // extra classes for container
}

/**
 * Modern Loader component.
 * - Default: ring spinner, size 48px, blue color.
 * - Use fullscreen for overlay.
 */
export default function Loader({
  variant = "ring",
  size = 48,
  thickness = 4,
  color = "#3B82F6", // default tailwind blue-500
  label = "Loading",
  fullscreen = false,
  className = "",
}: LoaderProps) {
  const container = (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      aria-hidden={label ? undefined : true}
    >
      {variant === "ring" && (
        <motion.svg
          width={size}
          height={size}
          viewBox="0 0 50 50"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, ease: "linear", duration: 1.1 }}
          role="img"
          aria-label={label}
        >
          <defs>
            <linearGradient id="g" x1="0%" x2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="1" />
              <stop offset="100%" stopColor={color} stopOpacity="0.15" />
            </linearGradient>
          </defs>
          <circle
            cx="25"
            cy="25"
            r={20}
            fill="none"
            stroke="rgba(0,0,0,0.08)"
            strokeWidth={thickness}
          />
          <path
            d="M25 5 a20 20 0 0 1 0 40"
            fill="none"
            stroke="url(#g)"
            strokeWidth={thickness}
            strokeLinecap="round"
          />
        </motion.svg>
      )}

      {variant === "dots" && (
        <div className="flex items-center gap-2" role="img" aria-label={label}>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block rounded-full"
              style={{
                width: Math.max(6, size / 6),
                height: Math.max(6, size / 6),
                background: color,
              }}
              initial={{ y: 0, opacity: 0.6 }}
              animate={{ y: [0, -8, 0], opacity: [0.6, 1, 0.6] }}
              transition={{
                repeat: Infinity,
                duration: 0.9,
                delay: i * 0.15,
              }}
            />
          ))}
        </div>
      )}

      {variant === "bars" && (
        <div className="flex items-end gap-1" role="img" aria-label={label}>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block rounded-sm"
              style={{
                width: Math.max(4, Math.round(size / 10)),
                background: color,
              }}
              initial={{ height: size / 6 }}
              animate={{ height: [size / 6, size / 2, size / 6] }}
              transition={{
                repeat: Infinity,
                duration: 0.9,
                delay: i * 0.12,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );

  // wrapper with optional label (visually shown or hidden for screen readers)
  const labelled = (
    <div className="flex flex-col items-center gap-2">
      {container}
      {label ? (
        // visually hidden on small UI but visible when provided (you can style)
        <span className="text-sm text-gray-500 sr-only">{label}</span>
      ) : null}
    </div>
  );

  if (fullscreen) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="fixed inset-0 z-9999 flex items-center justify-center bg-black/35 backdrop-blur-sm p-4"
      >
        <div className="bg-white/90 dark:bg-gray-900/80 rounded-2xl shadow-lg p-6 flex flex-col items-center gap-4">
          {container}
          {label ? <div className="text-sm text-gray-700 dark:text-gray-200">{label}</div> : null}
        </div>
      </div>
    );
  }

  return (
    <div role="status" aria-live="polite" className="inline-block">
      {labelled}
    </div>
  );
}
