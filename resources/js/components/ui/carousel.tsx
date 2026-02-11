"use client";
import React, { useEffect, useRef, useState, useId } from "react";

interface SlideData {
  title: string;
  button: string;
  src: string;
  link?: string;
}

const Slide = ({ slide, width, height, gap }: { slide: SlideData, width: number | string, height: number | string, gap: number }) => {
  const { src, title } = slide;

  return (
    <div
      className="flex flex-col items-center justify-center relative flex-shrink-0"
      style={{ width: width, paddingRight: gap }}
    >
      <div 
        className="relative w-full overflow-hidden bg-muted/5 rounded-xl"
        style={{ height: height }}
      >
        <img
          className="w-full h-full object-contain p-4 transition-opacity duration-600 ease-in-out"
          alt={title}
          src={src}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 hover:opacity-100 transition-opacity duration-300" />
      </div>

      <article className="mt-4 text-center w-full px-2">
        <h3 className="text-foreground text-sm font-bold uppercase tracking-wider truncate mb-2">
          {title}
        </h3>
        {slide.button && (
            <a 
              href={slide.link || "#"} 
              className="inline-block text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
                {slide.button}
            </a>
        )}
      </article>
    </div>
  );
};

import { animate, useMotionValue } from "framer-motion";

interface CarouselProps {
  slides: SlideData[];
  speed?: number;
  gap?: number;
  itemsToDisplay?: number;
  height?: number | string;
}

export function Carousel({ slides, speed = 20, gap = 8, itemsToDisplay = 4, height = 250 }: CarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const translation = useMotionValue(0);
  const [contentSize, setContentSize] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const id = useId();

  useEffect(() => {
    let controls: { stop: () => void } | undefined;
    const element = scrollerRef.current;
    if (!element) return;

    const measureContent = () => {
        setContentSize(element.scrollWidth / 2);
    };

    measureContent();
    const observer = new ResizeObserver(measureContent);
    observer.observe(element);

    const duration = (100 - speed) / 2; // Higher speed = lower duration

    if (contentSize > 0) {
        controls = animate(translation, [0, -contentSize], {
            ease: "linear",
            duration: isHovered ? duration * 2 : duration,
            repeat: Infinity,
            repeatType: "loop",
            repeatDelay: 0,
            onUpdate: (latest) => {
                element.style.transform = `translateX(${latest}px)`;
            },
        });
    }

    return () => {
        controls?.stop();
        observer.disconnect();
    };
  }, [translation, speed, contentSize, isHovered]);

  if (!slides || slides.length === 0) return null;

  // Duplicate slides for infinite scroll
  const allSlides = [...slides, ...slides];
  
  // Calculate slide width based on itemsToDisplay
  // We use a CSS variable for the width to handle responsive calculations if needed,
  // but for now we'll pass it as a percentage or pixel value.
  const slideWidth = `calc((100% - ${(itemsToDisplay - 1) * gap}px) / ${itemsToDisplay})`;

  return (
    <div 
        className="relative w-full overflow-hidden py-12" 
        aria-labelledby={`carousel-heading-${id}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="flex w-max"
        ref={scrollerRef}
        style={{ gap: 0 }} // Gap is handled inside Slide via padding for precise width calculation
      >
        {allSlides.map((slide, index) => (
          <Slide
            key={index}
            slide={slide}
            width={slideWidth}
            height={height}
            gap={gap}
          />
        ))}
      </div>
    </div>
  );
}
