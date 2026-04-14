import React, { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import { SharedData } from "@/types";
import { useReducedMotion } from "@/hooks/useAccessibility";

export const GlobalWatercolorBackground = () => {
  const { settings } = usePage<SharedData>().props;

  // 6.1 — detect mobile once at mount, update on resize
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // 6.4 — reduced motion check
  const prefersReducedMotion = useReducedMotion();

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
  const blurAmount = getBGSetting('bg_watercolor_blur', 140) as number;
  const overlayOpacity = getBGSetting('bg_watercolor_overlay_opacity', 0.5) as number;

  // 6.4 — omit animation class when reduced-motion is active
  const pulseClass = prefersReducedMotion ? '' : 'animate-gradient-pulse';

  return (
    // 6.3 — contain: paint on root div
    <div 
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      style={{ '--global-opacity': globalOpacity, contain: 'paint' } as React.CSSProperties}
    >
      <div 
        className="absolute inset-0 bg-gradient-to-br from-background via-background to-surface opacity-[var(--overlay-opacity)]" 
        style={{ '--overlay-opacity': overlayOpacity } as React.CSSProperties}
      />

      <div className="absolute inset-0">
        {/* 6.2 — blob 1: cap blur at 60px on mobile */}
        <div
          className={`bg-theme-start absolute -top-[20%] -left-[10%] h-[70vw] w-[70vw] rounded-full ${pulseClass}`}
          style={{ 
            filter: `blur(${isMobile ? Math.min(blurAmount, 60) : blurAmount}px)`,
            opacity: blob1Opacity,
            transform: 'translate(5%, 10%)'
          } as React.CSSProperties}
        />

        {/* 6.2 — blob 2: cap blur at 60px on mobile */}
        <div
          className={`bg-theme-end absolute top-[10%] -right-[15%] h-[60vw] w-[60vw] rounded-full ${pulseClass}`}
          style={{ 
            filter: `blur(${isMobile ? Math.min(Math.round(blurAmount * 0.85), 60) : Math.round(blurAmount * 0.85)}px)`,
            opacity: blob2Opacity,
            transform: 'translate(-5%, -5%)'
          } as React.CSSProperties}
        />

        {/* 6.2 — blob 3: cap blur at 60px on mobile */}
        <div
          className={`bg-theme-accent absolute bottom-[-10%] left-[20%] h-[50vw] w-[50vw] rounded-full ${pulseClass}`}
          style={{ 
            filter: `blur(${isMobile ? Math.min(Math.round(blurAmount * 0.7), 60) : Math.round(blurAmount * 0.7)}px)`,
            opacity: blob3Opacity,
            transform: 'translate(2%, 4%)'
          } as React.CSSProperties}
        />
      </div>

      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-10 dark:opacity-15 mix-blend-overlay"
        style={{ backgroundImage: 'var(--bg-noise-grain)' }}
      />

      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[var(--radial-dot)] bg-[length:48px_48px]"
        style={{
          '--radial-dot': `radial-gradient(circle at 2px 2px, var(--foreground) 1px, transparent 0)`
        } as React.CSSProperties}
      />
    </div>
  );
};

export default GlobalWatercolorBackground;
