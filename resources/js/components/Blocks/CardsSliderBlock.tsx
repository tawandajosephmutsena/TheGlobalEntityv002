"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { animate, motion, useMotionValue } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { CardsSliderBlock } from "@/types/page-blocks";

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

export default function CardsSliderBlockRenderer(props: CardsSliderBlock["content"]) {
  const { collection = "insights", limit = 5 } = props || {};

  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const x = useMotionValue(0);

  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `/api/collections/${collection}?limit=${limit}`
        );
        setCards(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch collection data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [collection, limit]);

  useEffect(() => {
    if (cards.length > 0 && containerRef.current) {
      setTimeout(() => {
        if (containerRef.current) {
          setWidth(
            containerRef.current.scrollWidth - containerRef.current.offsetWidth
          );
        }
      }, 100);
    }
  }, [cards]);

  const scrollTo = (direction: "left" | "right") => {
    const currentX = x.get();
    const containerWidth = containerRef.current?.offsetWidth || 0;
    const scrollAmount = containerWidth * 0.8;

    let newX =
      direction === "left" ? currentX + scrollAmount : currentX - scrollAmount;

    newX = Math.max(Math.min(newX, 0), -width);

    animate(x, newX, {
      type: "spring",
      stiffness: 300,
      damping: 30,
      mass: 1,
    });
  };

  if (loading) {
     return (
        <div className="w-full max-w-6xl mx-auto p-8 flex items-center justify-center">
            <div className="animate-pulse h-[420px] w-full bg-muted rounded-3xl"></div>
        </div>
     );
  }

  if (cards.length === 0) {
      return null;
  }

  return (
    <div className="w-full max-w-[1400px] 2xl:max-w-[1600px] mx-auto p-8 relative group/slider">
      {/* Navigation Arrows */}
      <div className="absolute top-1/2 -translate-y-1/2 left-2 z-20 opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300">
        <button
          onClick={() => scrollTo("left")}
          className="h-12 w-12 rounded-full bg-background/80 backdrop-blur-md border border-border/50 shadow-lg flex items-center justify-center hover:bg-background hover:scale-110 transition-all active:scale-95"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-2 z-20 opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300">
        <button
          onClick={() => scrollTo("right")}
          className="h-12 w-12 rounded-full bg-background/80 backdrop-blur-md border border-border/50 shadow-lg flex items-center justify-center hover:bg-background hover:scale-110 transition-all active:scale-95"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <motion.div
        ref={containerRef}
        className="cursor-grab active:cursor-grabbing overflow-hidden px-4 py-8 -mx-4 -my-8"
        whileTap={{ cursor: "grabbing" }}
      >
        <motion.div
          drag="x"
          dragConstraints={{ right: 0, left: -width }}
          dragElastic={0.1}
          style={{ x }}
          className="flex gap-6"
        >
          {cards.map((card) => (
            <motion.div
              key={card.id}
              className="min-w-[320px] max-w-[320px] h-[480px]"
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <Card className="group relative h-full overflow-hidden rounded-3xl border-border/50 bg-card/30 backdrop-blur-md transition-all duration-500 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10">
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                  <motion.img
                    src={card.image}
                    alt={card.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40" />

                  <div className="absolute top-4 left-4">
                    <Badge
                      variant="secondary"
                      className="bg-background/90 backdrop-blur-md border-white/10 text-xs font-medium px-3 py-1 text-foreground"
                    >
                      {card.category}
                    </Badge>
                  </div>

                  {/* Hover Overlay Action */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {card.url ? (
                        <a href={card.url}>
                            <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 rounded-full bg-white/90 px-5 py-2 text-sm font-semibold text-black shadow-lg"
                            >
                            View Details
                            </motion.button>
                        </a>
                    ) : (
                        <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 rounded-full bg-white/90 px-5 py-2 text-sm font-semibold text-black shadow-lg"
                        >
                        View Details
                        </motion.button>
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col h-[calc(100%-12rem)] justify-between">
                  <div className="space-y-3">
                    {card.url ? (
                        <a href={card.url} className="hover:underline">
                            <h3 className="text-xl font-bold leading-tight tracking-tight text-foreground transition-colors group-hover:text-primary">
                            {card.title}
                            </h3>
                        </a>
                    ) : (
                        <h3 className="text-xl font-bold leading-tight tracking-tight text-foreground transition-colors group-hover:text-primary">
                        {card.title}
                        </h3>
                    )}
                    <p className="line-clamp-3 text-sm text-muted-foreground leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-auto border-t border-border/50 flex items-center justify-between">
                    <div className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
                      <Avatar className="h-8 w-8 border border-border/50 ring-2 ring-background">
                        <AvatarImage
                          src={card.author.avatar}
                          alt={card.author.name}
                        />
                        <AvatarFallback>{card.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-foreground">
                          {card.author.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                          <Clock className="h-3 w-3" />
                          {card.date}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-secondary/50 px-2.5 py-1 rounded-full">
                      <span>{card.readTime}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
