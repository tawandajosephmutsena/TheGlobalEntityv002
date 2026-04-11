"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

export const GlobalWatercolorBackground = () => {
  // Optimized color pools for light/dark transition
  // We use CSS variables so they are theme-aware automatically
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base Gradient Surface - semi-transparent to allow deep immersion */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-surface opacity-50" />

      {/* Animated Liquid Blobs */}
      <div className="absolute inset-0">
        {/* Blob 1: Primary/Start Color */}
        <motion.div
          animate={{
            x: ["-10%", "20%", "-10%"],
            y: ["-10%", "30%", "-10%"],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="bg-theme-start absolute -top-[20%] -left-[10%] h-[70vw] w-[70vw] rounded-full blur-[140px] opacity-[0.4] dark:opacity-[0.3]"
        />

        {/* Blob 2: End Color */}
        <motion.div
          animate={{
            x: ["10%", "-20%", "10%"],
            y: ["40%", "-10%", "40%"],
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="bg-theme-end absolute top-[10%] -right-[15%] h-[60vw] w-[60vw] rounded-full blur-[120px] opacity-[0.35] dark:opacity-[0.25]"
        />

        {/* Blob 3: Accent Color */}
        <motion.div
          animate={{
            x: ["0%", "30%", "0%"],
            y: ["20%", "70%", "20%"],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="bg-theme-accent absolute bottom-[-10%] left-[20%] h-[50vw] w-[50vw] rounded-full blur-[100px] opacity-[0.3] dark:opacity-[0.2]"
        />
      </div>

      {/* SVG Grain Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.15] dark:opacity-[0.25] mix-blend-overlay pointer-events-none">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="global-noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.6"
              numOctaves="2"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#global-noise)" />
        </svg>
      </div>

      {/* Subtle Mesh Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, var(--foreground) 1px, transparent 0)`,
          backgroundSize: '48px 48px'
        }}
      />
    </div>
  );
};

export default GlobalWatercolorBackground;
