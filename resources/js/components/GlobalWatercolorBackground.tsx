import React, { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import { SharedData } from "@/types";
import { useReducedMotion } from "@/hooks/useAccessibility";
import { cn } from "@/lib/utils";

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
    if (!item) return defaultValue;

    // Settings in grouped collections like 'settings?.background' often come wrapped as [value]
    // because the Setting model casts 'value' as an array.
    const rawValue = item.value;
    const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;

    if (value === null || value === '' || value === undefined) return defaultValue;
    
    // Handle specific types
    if (typeof defaultValue === 'boolean') {
      return value === 'true' || value === true || value === '1' || value === 'on' || value === 'yes';
    }
    if (typeof defaultValue === 'number') {
      return parseFloat(value as string);
    }
    return value;
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

  // 6.4 — omit animation class when reduced-motion is active
  const pulseClass = prefersReducedMotion ? '' : 'animate-gradient-pulse';

  return (
    // 6.3 — contain: paint on root div
    <div 
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      style={{ 
        opacity: globalOpacity,
        '--overlay-opacity': overlayOpacity,
        '--blur-amount': `${isMobile ? Math.min(blurAmount, 60) : Math.min(blurAmount, 240)}px`,
        '--blur-amount-secondary': `${isMobile ? Math.min(Math.round(blurAmount * 0.85), 50) : Math.min(Math.round(blurAmount * 0.85), 200)}px`,
        '--blur-amount-tertiary': `${isMobile ? Math.min(Math.round(blurAmount * 0.7), 40) : Math.min(Math.round(blurAmount * 0.7), 180)}px`,
        contain: 'paint' 
      } as React.CSSProperties}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-surface opacity-[var(--overlay-opacity)]" />

      <div className="absolute inset-0">
        {/* Blob 1 */}
        <div
          className={cn(
            "bg-theme-start absolute -top-[20%] -left-[10%] h-[70vw] w-[70vw] rounded-full will-change-[transform,opacity]",
            pulseClass
          )}
          style={{ 
            filter: 'blur(var(--blur-amount))',
            opacity: blob1Opacity,
            transform: 'translate3d(5%, 10%, 0)'
          } as React.CSSProperties}
        />

        {/* Blob 2 */}
        <div
          className={cn(
            "bg-theme-end absolute top-[10%] -right-[15%] h-[60vw] w-[60vw] rounded-full will-change-[transform,opacity]",
            pulseClass
          )}
          style={{ 
            filter: 'blur(var(--blur-amount-secondary))',
            opacity: blob2Opacity,
            transform: 'translate3d(-5%, -5%, 0)'
          } as React.CSSProperties}
        />

        {/* Blob 3 */}
        <div
          className={cn(
            "bg-theme-accent absolute bottom-[-10%] left-[20%] h-[50vw] w-[50vw] rounded-full will-change-[transform,opacity]",
            pulseClass
          )}
          style={{ 
            filter: 'blur(var(--blur-amount-tertiary))',
            opacity: blob3Opacity,
            transform: 'translate3d(2%, 4%, 0)'
          } as React.CSSProperties}
        />
      </div>

      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ 
          backgroundImage: 'var(--bg-noise-grain)',
          opacity: noiseOpacity,
          mixBlendMode: 'overlay'
        } as React.CSSProperties}
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
