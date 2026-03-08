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

export default function StackedCardsBlockRenderer(props: StackedCardsBlock['content']) {
  const {
    collection = 'insights',
    limit = 5,
    title = 'Discover More',
    description = 'Explore our latest updates and insights.',
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
      <section className="w-full py-20 bg-background flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-8 w-64 bg-muted rounded"></div>
          <div className="h-96 w-full max-w-4xl bg-muted rounded-xl"></div>
        </div>
      </section>
    );
  }

  if (cards.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-20 lg:py-32 bg-background overflow-hidden relative">
      <div className="container mx-auto px-4 md:px-6">
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

        <div className="relative h-[500px] md:h-[600px] w-full max-w-5xl mx-auto flex items-center justify-center perspective-1000">
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
                  className="absolute w-full max-w-4xl mx-auto cursor-grab active:cursor-grabbing origin-top"
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
                  <Card className="overflow-hidden border-border/50 bg-card shadow-2xl rounded-3xl h-[450px] md:h-[550px] flex flex-col md:flex-row">
                    <div className="w-full md:w-1/2 h-48 md:h-full relative overflow-hidden">
                      <motion.div
                        className="w-full h-full"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                      >
                        <img 
                          src={card.image} 
                          alt={card.title} 
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                      <div className="absolute top-4 left-4 z-10">
                        <Badge variant="default" className="bg-primary/90 text-primary-foreground backdrop-blur-sm">
                          {card.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-between">
                      <div>
                        {card.url ? (
                          <a href={card.url} className="hover:underline">
                            <h3 className="text-2xl md:text-3xl font-bold mb-4 line-clamp-2">{card.title}</h3>
                          </a>
                        ) : (
                          <h3 className="text-2xl md:text-3xl font-bold mb-4 line-clamp-2">{card.title}</h3>
                        )}
                        <p className="text-muted-foreground line-clamp-4 md:line-clamp-6 text-lg">
                          {card.description}
                        </p>
                      </div>
                      
                      <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-border">
                            <AvatarImage src={card.author.avatar} alt={card.author.name} />
                            <AvatarFallback>{card.author.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{card.author.name}</span>
                            <span className="text-xs text-muted-foreground">{card.date}</span>
                          </div>
                        </div>
                        <div className="flex items-center text-muted-foreground text-sm gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{card.readTime}</span>
                        </div>
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
