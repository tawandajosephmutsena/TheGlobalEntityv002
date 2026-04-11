"use client";
import React, {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
  useCallback,
  useMemo,
} from "react";
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconX,
} from "@tabler/icons-react";
import CategoryIcon from "@/components/CategoryIcon";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";

interface CarouselProps {
  items: React.ReactNode[];
  initialScroll?: number;
  title?: string;
  subtitle?: string;
  description?: string;
  // Metadata for filtering
  cardsData?: Card[];
}

type Card = {
  src: string;
  title: string;
  subtitle?: string;
  description?: string;
  category: string;
  categoryIcon?: string;
  content?: React.ReactNode;
  link?: string;
};

export const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  currentIndex: number;
}>({
  onCardClose: () => {},
  currentIndex: 0,
});

export const Carousel = ({ items, initialScroll = 0, cardsData, title, subtitle, description }: CarouselProps) => {
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = useMemo(() => {
    if (!cardsData) return [];
    const cats = Array.from(new Set(cardsData.map(c => c.category)));
    return ["All", ...cats];
  }, [cardsData]);

  const checkScrollability = useCallback(() => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  }, []);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [initialScroll, checkScrollability, activeCategory]);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const handleCardClose = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = isMobile() ? 230 : 384; 
      const gap = isMobile() ? 4 : 8;
      const scrollPosition = (cardWidth + gap) * (index + 1);
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  const isMobile = () => {
    return typeof window !== "undefined" && window.innerWidth < 768;
  };

  const filteredItems = useMemo(() => {
    if (!cardsData || activeCategory === "All") return items;
    return items.filter((_, idx) => cardsData[idx].category === activeCategory);
  }, [items, cardsData, activeCategory]);

  return (
    <CarouselContext.Provider
      value={{ onCardClose: handleCardClose, currentIndex }}
    >
      <div className="relative w-full">
        {/* Navigation and Metadata Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between px-4 mb-6 max-w-7xl mx-auto gap-8 overflow-visible">
            <div className="flex flex-col gap-2 order-2 md:order-1 flex-1">
                {subtitle && (
                    <p className="text-[10px] md:text-xs font-black tracking-[0.2em] text-primary [font-variant-caps:small-caps] opacity-80 decoration-primary decoration-2 underline-offset-4 mb-1">
                        {subtitle}
                    </p>
                )}
                <motion.h2 
                    layoutId="carousel-title"
                    className="text-4xl md:text-6xl font-black text-on-surface [font-variant-caps:small-caps] tracking-tighter leading-none"
                >
                    {title}
                </motion.h2>
                {description && (
                    <p className="text-on-surface-variant text-base md:text-lg font-light max-w-2xl leading-relaxed mt-4 opacity-70">
                        {description}
                    </p>
                )}
            </div>
            
            <div className="flex gap-3 items-center order-1 md:order-2 self-end pb-2">
                <button
                    className="relative z-40 h-10 w-10 md:h-12 md:w-12 rounded-full liquid-glass flex items-center justify-center disabled:opacity-50 transition-all hover:scale-110 active:scale-95 group border border-on-surface/5"
                    onClick={scrollLeft}
                    disabled={!canScrollLeft}
                    title="Scroll Left"
                >
                    <IconArrowNarrowLeft className="h-6 w-6 text-on-surface group-hover:text-primary transition-colors" />
                </button>
                <button
                    className="relative z-40 h-10 w-10 md:h-12 md:w-12 rounded-full liquid-glass flex items-center justify-center disabled:opacity-50 transition-all hover:scale-110 active:scale-95 group border border-on-surface/5"
                    onClick={scrollRight}
                    disabled={!canScrollRight}
                    title="Scroll Right"
                >
                    <IconArrowNarrowRight className="h-6 w-6 text-on-surface group-hover:text-primary transition-colors" />
                </button>
            </div>
        </div>

        {/* CATEGORY FILTERING BUTTONS */}
        <div className="flex flex-wrap gap-2 mb-8 md:mb-12 px-4 md:px-10 max-w-7xl mx-auto overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
            {categories.length > 1 && categories.map((cat) => (
                <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                        "group flex items-center gap-3 px-6 py-2.5 rounded-full text-[10px] font-black tracking-widest transition-all [font-variant-caps:small-caps] whitespace-nowrap border",
                        activeCategory === cat 
                            ? "bg-primary text-on-primary border-primary shadow-xl shadow-primary/20 scale-105" 
                            : "liquid-glass text-on-surface/40 border-on-surface/5 hover:text-on-surface hover:border-on-surface/20 hover:bg-on-surface/5"
                    )}
                >
                    {cat !== "All" && cardsData && (
                        <CategoryIcon 
                            category={cat.toLowerCase().replace(/\s+/g, '-')} 
                            icon={cardsData.find(c => c.category === cat)?.categoryIcon}
                            className={cn("transition-transform", activeCategory === cat ? "scale-110" : "group-hover:scale-110")} 
                            variant="icon-only"
                            size={16}
                        />
                    )}
                    {cat}
                </button>
            ))}
        </div>

        <div
          className="flex w-full overflow-x-scroll overscroll-x-auto scroll-smooth py-4 [scrollbar-width:none] md:py-10"
          ref={carouselRef}
          onScroll={checkScrollability}
        >
          <div
            className={cn(
              "flex flex-row justify-start gap-4 pl-4",
              "mx-auto max-w-7xl", 
            )}
          >
            <AnimatePresence mode="popLayout">
                {filteredItems.map((item, index) => (
                    <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ 
                            opacity: 1, 
                            scale: 1,
                            transition: {
                                duration: 0.4,
                                delay: 0.1 * index,
                                ease: "easeOut",
                            },
                        }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        key={activeCategory + index}
                        className="rounded-3xl"
                    >
                        {item}
                    </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

export const Card = ({
  card,
  index,
  layout = false,
}: {
  card: Card;
  index: number;
  layout?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { onCardClose } = useContext(CarouselContext);

  const handleClose = useCallback(() => {
    setOpen(false);
    onCardClose(index);
  }, [onCardClose, index]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleClose();
      }
    }

    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, handleClose]);

  useOutsideClick(containerRef, () => handleClose());

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClick = () => {
    if (card.link) {
      window.location.href = card.link;
      return;
    }
    handleOpen();
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[100] h-screen overflow-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 h-full w-full bg-black/40 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              ref={containerRef}
              layoutId={layout ? `card-${card.title}` : undefined}
              className="relative z-[110] mx-auto my-10 h-fit max-w-5xl rounded-3xl bg-background border border-border font-sans overflow-hidden shadow-2xl"
            >
              <button
                className="absolute top-4 right-4 z-[120] flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background transition-transform hover:rotate-90"
                onClick={handleClose}
                aria-label="Close"
                type="button"
              >
                <IconX className="h-6 w-6" />
              </button>
              <motion.div 
                layoutId={layout ? `image-${card.title}` : undefined}
                className="w-full h-80 md:h-[30rem] relative"
              >
                <img 
                  src={card.src} 
                  alt={card.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
              </motion.div>
              <div className="p-6 md:p-12 -mt-20 relative z-20">
                <motion.div
                    layoutId={layout ? `category-container-${card.title}` : undefined}
                    className="flex items-center gap-2 mb-4"
                >
                    <div className="p-2 rounded-lg bg-foreground/5 backdrop-blur-sm border border-foreground/10">
                        <CategoryIcon 
                            category={card.category} 
                            icon={card.categoryIcon} 
                            className="text-foreground" 
                            size={20}
                        />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-widest text-foreground/60 leading-none">{card.category}</span>
                </motion.div>
                
                <motion.h3
                  layoutId={layout ? `title-${card.title}` : undefined}
                  className="text-4xl md:text-6xl font-black text-foreground [font-variant-caps:small-caps] tracking-tighter leading-none"
                >
                  {card.title}
                </motion.h3>

                {card.subtitle && (
                   <motion.p className="mt-4 text-xl md:text-2xl font-medium text-foreground/70 italic">
                      {card.subtitle}
                   </motion.p>
                )}

                {card.description && (
                   <motion.p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                      {card.description}
                   </motion.p>
                )}

                <div className="mt-12 pt-12 border-t border-border">{card.content}</div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <motion.button
        layoutId={layout ? `card-${card.title}` : undefined}
        onClick={handleClick}
        className="relative z-10 flex h-[28rem] w-80 flex-col items-start justify-start overflow-hidden rounded-3xl bg-muted md:h-[32rem] md:w-96 group border border-border/50 shadow-sm transition-all hover:shadow-xl hover:border-foreground/20"
        type="button"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-full bg-gradient-to-b from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
        
        <div className="relative z-40 p-6 md:p-10 w-full text-left">
          <motion.div 
            layoutId={layout ? `category-container-${card.title}` : undefined}
            className="flex items-center gap-2 mb-3"
          >
              <div className="p-1.5 rounded-md bg-white/10 backdrop-blur-md border border-white/20">
                  <CategoryIcon 
                    category={card.category} 
                    icon={card.categoryIcon} 
                    className="text-white" 
                    size={14}
                  />
              </div>
              <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-white/80 leading-none">{card.category}</span>
          </motion.div>
          
          <motion.h4
            layoutId={layout ? `title-${card.title}` : undefined}
            className="text-2xl md:text-4xl font-black text-white [font-variant-caps:small-caps] tracking-tighter leading-none"
          >
            {card.title}
          </motion.h4>
        </div>

        <BlurImage
          src={card.src}
          alt={card.title}
          layoutId={layout ? `image-${card.title}` : undefined}
          className="absolute inset-0 w-full h-full z-10 object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </motion.button>
    </>
  );
};

export const BlurImage = ({
  height,
  width,
  src,
  className,
  alt,
  layoutId,
  ...rest
}: React.ImgHTMLAttributes<HTMLImageElement> & { layoutId?: string }) => {
  const [isLoading, setLoading] = useState(true);
  // Separate motion props from standard img props
  const { onDrag: _onDrag, ...imgProps } = rest as Record<string, unknown>;

  return (
    <motion.img
      layoutId={layoutId}
      className={cn(
        "transition duration-500",
        isLoading ? "blur-md scale-105" : "blur-0 scale-100",
        className,
      )}
      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
      onLoad={() => setLoading(false)}
      src={src as string}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      alt={alt || "Image"}
      {...imgProps}
    />
  );
};

