"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import axios from 'axios';
import { StackedCardsBlock } from '@/types/page-blocks';
import { cn } from '@/lib/utils';

interface CardData {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  readTime: string;
  url?: string;
}

export default function StackedCardsBlockRenderer(props: StackedCardsBlock['content'] & { disableSectionPadding?: boolean }) {
  const {
    collection = 'insights',
    limit = 5,
    title = 'Discover More',
    description = 'Explore our latest updates and insights.',
    disableSectionPadding = false,
  } = props || {};

  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/collections/${collection}?limit=${limit}`);
        setCards(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch collection data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [collection, limit]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  if (loading) {
    return (
      <section className="w-full py-20 bg-transparent flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4 w-full max-w-4xl px-4">
          <div className="h-8 w-64 bg-muted rounded"></div>
          <div className="h-96 w-full bg-muted rounded-3xl" />
        </div>
      </section>
    );
  }

  if (cards.length === 0) {
    return null;
  }

  return (
    <section className={cn("w-full bg-transparent overflow-hidden relative", disableSectionPadding ? "py-4" : "py-20 lg:py-32")}>
      <div className={cn("container mx-auto", disableSectionPadding ? "px-0" : "px-4 md:px-6")}>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-20 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              {title}
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl">
              {description}
            </p>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full border border-border bg-background hover:bg-muted transition-colors z-10"
              aria-label="Previous card"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="p-3 rounded-full border border-border bg-background hover:bg-muted transition-colors z-10"
              aria-label="Next card"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="relative min-h-[450px] h-[60vh] max-h-[700px] w-full max-w-5xl mx-auto flex items-center justify-center perspective-1000">
          <AnimatePresence mode="popLayout">
            {cards.map((card, index) => {
              // Calculate positional offset
              const offset = index - activeIndex;
              // Wrap around logic for infinite feel (optional, but good for stacks)
              const isVisible = Math.abs(offset) <= 2;
              
              if (!isVisible && index !== cards.length - 1 && index !== 0) return null;

              const scale = offset === 0 ? 1 : offset > 0 ? 1 - (offset * 0.05) : 1.1;
              const y = offset === 0 ? 0 : offset > 0 ? offset * 40 : -100;
              const zIndex = 50 - Math.abs(offset);
              const opacity = offset === 0 ? 1 : offset > 0 ? 1 - (offset * 0.2) : 0;
              const rotateX = offset > 0 ? 5 : 0;

              return (
                <motion.div
                  key={card.id}
                  initial={false}
                  animate={{
                    scale,
                    y,
                    opacity,
                    zIndex,
                    rotateX: offset > 0 ? 5 : 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  }}
                  className="absolute w-full h-full max-w-4xl mx-auto cursor-grab active:cursor-grabbing origin-top"
                  style={{ transformStyle: "preserve-3d" }}
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 0 }}
                  onDragEnd={(e, { offset }) => {
                    const swipe = offset.y;
                    if (swipe < -50) {
                      handleNext();
                    } else if (swipe > 50) {
                      handlePrev();
                    }
                  }}
                >
                  <Card className="overflow-hidden liquid-glass rounded-[2.5rem] h-[450px] md:h-[600px] relative group shadow-none border-none">
                    {/* Full Size Image */}
                    <div className="absolute inset-0 z-0">
                      <motion.div
                        className="w-full h-full"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.6 }}
                      >
                        <img 
                          src={card.image} 
                          alt={card.title} 
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    </div>

                    {/* Gradient Overlay for Legibility */}
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                    {/* Badge Positioned Top Left */}
                    <div className="absolute top-6 left-6 z-20">
                      <Badge variant="default" className="bg-white/20 text-white backdrop-blur-md border-white/20 px-3 py-1 text-xs">
                        {card.category}
                      </Badge>
                    </div>
                    
                    {/* Content Overlayed at the bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 lg:p-12 z-20">
                      <div className="max-w-3xl">
                        {card.url ? (
                          <a href={card.url} className="hover:underline decoration-white/30 underline-offset-8">
                            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-white leading-tight drop-shadow-sm">
                              {card.title}
                            </h3>
                          </a>
                        ) : (
                          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-white leading-tight drop-shadow-sm">
                            {card.title}
                          </h3>
                        )}
                        <p className="text-white/80 line-clamp-3 md:line-clamp-4 text-base md:text-lg leading-relaxed max-w-2xl font-medium">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
