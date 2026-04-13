import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { usePage } from "@inertiajs/react";
import { SharedData } from "@/types";

export const GlobalWatercolorBackground = () => {
  const { settings } = usePage<SharedData>().props;

  // Helper to extract a background setting with a default fallback
  const getBGSetting = (key: string, defaultValue: string | number | boolean) => {
    const bgSettings = settings?.background || [];
    const item = bgSettings.find((s) => s.key === key);
    if (!item || item.value === null || item.value === '') return defaultValue;
    
    // Handle specific types
    if (typeof defaultValue === 'boolean') {
      return item.value === 'true' || item.value === true || item.value === '1';
    }
    if (typeof defaultValue === 'number') {
      return parseFloat(item.value as string);
    }
    return item.value;
  };

  const isEnabled = getBGSetting('bg_watercolor_enabled', true);
  if (!isEnabled) return null;

  // Configuration from settings
  const globalOpacity = getBGSetting('bg_watercolor_opacity', 1) as number;
  const blob1Opacity = getBGSetting('bg_watercolor_blob1_opacity', 0.4) as number;
  const blob2Opacity = getBGSetting('bg_watercolor_blob2_opacity', 0.35) as number;
  const blob3Opacity = getBGSetting('bg_watercolor_blob3_opacity', 0.3) as number;
  const noiseOpacity = getBGSetting('bg_watercolor_noise_opacity', 0.15) as number;
  const blurAmount = getBGSetting('bg_watercolor_blur', 140) as number;
  const overlayOpacity = getBGSetting('bg_watercolor_overlay_opacity', 0.5) as number;

  return (
    <div 
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      style={{ opacity: globalOpacity }}
    >
      {/* Base Gradient Surface - semi-transparent to allow deep immersion */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-background via-background to-surface" 
        style={{ opacity: overlayOpacity }}
      />

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
          className="bg-theme-start absolute -top-[20%] -left-[10%] h-[70vw] w-[70vw] rounded-full"
          style={{ 
            filter: `blur(${blurAmount}px)`,
            opacity: blob1Opacity,
            willChange: "transform, opacity"
          }}
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
          className="bg-theme-end absolute top-[10%] -right-[15%] h-[60vw] w-[60vw] rounded-full"
          style={{ 
            filter: `blur(${Math.round(blurAmount * 0.85)}px)`,
            opacity: blob2Opacity 
          }}
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
          className="bg-theme-accent absolute bottom-[-10%] left-[20%] h-[50vw] w-[50vw] rounded-full"
          style={{ 
            filter: `blur(${Math.round(blurAmount * 0.7)}px)`,
            opacity: blob3Opacity,
            willChange: "transform, opacity"
          }}
        />
      </div>

      {/* SVG Grain Texture Overlay */}
      <div 
        className="absolute inset-0 mix-blend-overlay pointer-events-none"
        style={{ opacity: noiseOpacity }}
      >
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="global-noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.6"
              numOctaves="1"
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
