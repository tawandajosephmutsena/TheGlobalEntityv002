"use client";
import React, { useEffect, useRef, useState, useId } from "react";
import { IconArrowNarrowRight, IconArrowNarrowLeft } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface SlideData {
  title: string;
  button: string;
  src: string;
  link?: string;
}

interface SlideProps {
  slide: SlideData;
  index: number;
  current: number;
  handleSlideClick: (index: number) => void;
}

const Slide = ({ slide, index, current, handleSlideClick }: SlideProps) => {
  const slideRef = useRef<HTMLLIElement>(null);
  const xRef = useRef(0);
  const yRef = useRef(0);
  const frameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const animate = () => {
      if (!slideRef.current) return;
      const x = xRef.current;
      const y = yRef.current;
      slideRef.current.style.setProperty("--x", `${x}px`);
      slideRef.current.style.setProperty("--y", `${y}px`);
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const handleMouseMove = (event: React.MouseEvent) => {
    const el = slideRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    xRef.current = event.clientX - (r.left + r.width / 2);
    yRef.current = event.clientY - (r.top + r.height / 2);
  };

  const handleMouseLeave = () => {
    xRef.current = 0;
    yRef.current = 0;
  };

  const imageLoaded = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.style.opacity = "1";
  };

  const { src, title } = slide;

  return (
    <li
      ref={slideRef}
      className="flex flex-1 flex-col items-center justify-center relative z-10 w-[70vmin] h-[70vmin] opacity-100 transition-all duration-600 ease-in-out"
      onClick={() => handleSlideClick(index)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: current !== index 
          ? "scale(0.8) rotateX(2deg) rotateY(15deg)"
          : "scale(1) rotateX(0deg) rotateY(0deg)",
        transition: "transform 0.5s cubic-bezier(0.1, 0.7, 0.1, 1)",
      }}
    >
      <div
        className="absolute top-0 left-0 w-full h-full bg-[#1D1F2F] rounded-[2%] overflow-hidden transition-all duration-150 ease-out"
        style={{
          transform: current === index 
            ? "translate3d(calc(var(--x) / 30), calc(var(--y) / 30), 0)"
            : "none",
        }}
      >
        <img
          className="absolute inset-0 w-[120%] h-[120%] object-cover opacity-0 transition-opacity duration-600 ease-in-out translate-x-[-10%] translate-y-[-10%]"
          style={{
            transform: current === index
              ? "translate3d(calc(var(--x) / 40), calc(var(--y) / 40), 0)"
              : "none",
          }}
          alt={title}
          src={src}
          onLoad={imageLoaded}
          loading="lazy"
        />
        {current === index && (
          <div className="absolute inset-0 bg-black/30 transition-all duration-1000" />
        )}
      </div>

      <article
        className={cn(
          "relative p-[4vmin] transition-all duration-1000 ease-in-out",
          current === index ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-4"
        )}
      >
        <h2 className="text-white text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-none mb-6">
          {title}
        </h2>
        <div className="flex justify-start">
            <a 
              href={slide.link || "#"} 
              className="bg-white text-black px-6 py-3 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-agency-accent hover:text-white transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
                {slide.button}
            </a>
        </div>
      </article>
    </li>
  );
};

interface CarouselControlProps {
  type: string;
  title: string;
  handleClick: () => void;
}

const CarouselControl = ({ type, title, handleClick }: CarouselControlProps) => {
  return (
    <button
      className={cn(
        "flex items-center justify-center h-12 w-12 rounded-full bg-white/10 border border-white/20 text-white transition-all hover:bg-white/20 hover:scale-110",
        type === "previous" ? "mr-4" : "ml-4"
      )}
      title={title}
      onClick={handleClick}
    >
      {type === "previous" ? <IconArrowNarrowLeft /> : <IconArrowNarrowRight />}
    </button>
  );
};

interface CarouselProps {
  slides: SlideData[];
}

export function Carousel({ slides }: CarouselProps) {
  const [current, setCurrent] = useState(0);

  const handlePreviousClick = () => {
    const previous = current - 1;
    setCurrent(previous < 0 ? slides.length - 1 : previous);
  };

  const handleNextClick = () => {
    const next = current + 1;
    setCurrent(next === slides.length ? 0 : next);
  };

  const handleSlideClick = (index: number) => {
    if (current !== index) {
      setCurrent(index);
    }
  };

  const id = useId();

  if (!slides || slides.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden py-32 bg-transparent" aria-labelledby={`carousel-heading-${id}`}>
      {/* Dynamic Dotted Glow Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--agency-accent-rgb)_0%,_transparent_70%)] opacity-20 animate-pulse" 
             style={{ '--agency-accent-rgb': 'rgba(var(--agency-accent), 0.15)' } as React.CSSProperties} />
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
          backgroundSize: '40px 40px' 
        }} />
      </div>

      <div className="relative w-full max-w-[90vw] h-[80vh] mx-auto flex items-center justify-center">
        <ul
            className="flex transition-transform duration-1000 ease-[cubic-bezier(0.1, 0.7, 0.1, 1)]"
            style={{
              transform: `translateX(-${current * (100 / slides.length)}%)`,
              width: `${slides.length * 100}%`
            }}
        >
            {slides.map((slide, index) => (
            <Slide
                key={index}
                slide={slide}
                index={index}
                current={current}
                handleSlideClick={handleSlideClick}
            />
            ))}
        </ul>

        {/* Navigation Controls */}
        <div className="absolute flex justify-center w-full bottom-[-4rem] z-20">
            <CarouselControl
                type="previous"
                title="Go to previous slide"
                handleClick={handlePreviousClick}
            />

            <CarouselControl
                type="next"
                title="Go to next slide"
                handleClick={handleNextClick}
            />
        </div>
      </div>
    </div>
  );
}
