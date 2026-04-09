"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link, useForm } from "@inertiajs/react";
import type { CTAHeroBlock } from "@/types/page-blocks";
import CategoryIcon from "@/components/CategoryIcon";
import { GLSLHills } from "@/components/ui/GLSLHills";

export default function CTAHeroBlock({
  badge = "New Feature",
  titlePrefix = "Elevate Your",
  titleHighlight = "Digital Presence",
  description = "Transform your workflow with our cutting-edge platform designed for modern teams.",
  emailPlaceholder = "Enter your work email",
  buttonText = "Get Started Free",
  buttonLink = "#",
  benefits = [
    "No credit card required",
    "Cancel anytime",
    "Free 14-day trial",
  ],
  statsValue = "4.9/5",
  statsLabel = "from 2,000+ reviews",
  image = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
  imageLink = "",
}: CTAHeroBlock['content']) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { data, setData, post, processing, reset } = useForm({
    email: "",
    form_title: "CTA Hero Form",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data.email) {
      post('/contact', {
        preserveScroll: true,
        onSuccess: () => {
          setIsSubmitted(true);
          reset();
          setTimeout(() => {
            setIsSubmitted(false);
          }, 3000);
        }
      });
    }
  };

  return (
    <section className="relative w-full overflow-hidden gradient-mesh gradient-motion-bg px-4 pt-48 pb-32">
      {/* GLSL Hills Background Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <GLSLHills 
          speed={0.4} 
          cameraZ={110} 
          className="opacity-80"
        />
        
        {/* Animated gradient background blobs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="bg-theme-start absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -120, 0],
            y: [0, 80, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="bg-theme-end absolute top-[20%] -right-[5%] h-[35%] w-[35%] rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="bg-theme-accent absolute bottom-[10%] left-[30%] h-[25%] w-[25%] rounded-full blur-[80px]"
        />
      </div>

      {/* Gradient dot grid texture overlay */}
      <div className="absolute inset-0 gradient-dot-grid opacity-30 pointer-events-none" aria-hidden="true" />

      <div className="container relative mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column: Content */}
          <div className="flex flex-col items-start space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge
                variant="outline"
                className="bg-primary/5 border-primary/20 text-primary flex items-center gap-2 px-3 py-1 font-black ring-1 ring-inset [font-variant-caps:small-caps] lowercase"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {badge}
              </Badge>
            </motion.div>

            <div className="space-y-6">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="font-display text-4xl font-black tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl [font-variant-caps:small-caps]"
              >
                {titlePrefix}{" "}
                <span className="theme-gradient-text relative inline-block">
                  {titleHighlight}
                  <svg
                    className="text-theme-accent absolute -bottom-2 left-0 -z-10 h-3 w-full opacity-30"
                    viewBox="0 0 100 12"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0,10 Q50,0 100,10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-muted-foreground max-w-[600px] text-lg sm:text-xl"
              >
                {description}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-full max-w-md space-y-4"
            >
              <form onSubmit={handleSubmit} className="relative flex flex-col gap-3 sm:flex-row">
                <Input
                  type="email"
                  placeholder={emailPlaceholder}
                  className="border-theme-soft h-12 bg-background/50 backdrop-blur-sm focus-visible:ring-2"
                  value={data.email}
                  onChange={(e) => setData("email", e.target.value)}
                  disabled={processing || isSubmitted}
                  required
                />
                <Button 
                  type="submit"
                  disabled={processing || isSubmitted || !data.email}
                  className="group h-12 px-8 theme-gradient-animated text-white border-none hover:shadow-lg theme-gradient-glow"
                >
                  {isSubmitted ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Saved!
                    </>
                  ) : processing ? (
                    "Sending..."
                  ) : (
                    <>
                      {buttonText}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </form>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 sm:gap-x-8">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center text-sm font-medium"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                    {benefit}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center gap-4 pt-4"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {['travel-trouble', 'festival-fever', 'living-from-the-heart', 'social-sustainability', 'glocal-gems', 'solo-travel'].map((category) => (
                    <CategoryIcon 
                      key={category}
                      category={category} 
                      variant="badge"
                      size={18} 
                      className="border-2 border-background"
                      glow={false}
                    />
                  ))}
                </div>
                <div className="text-sm">
                  <span className="font-bold">{statsValue}</span>
                  <span className="text-muted-foreground ml-1">
                    {statsLabel}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Visual/Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative lg:ml-auto"
          >
            <div className="relative aspect-[4/3] w-full md:aspect-video lg:aspect-square lg:w-[500px]">
              <div className="relative h-full w-full">
                {imageLink ? (
                  <Link href={imageLink} className="block h-full w-full group">
                    <img 
                      src={image} 
                      alt={titleHighlight || "Hero visual"} 
                      className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px] rounded-xl">
                      <div className="rounded-full bg-background/90 p-4 shadow-xl text-primary">
                        <ArrowRight className="h-6 w-6" />
                      </div>
                    </div>
                  </Link>
                ) : (
                  <img 
                    src={image} 
                    alt={titleHighlight || "Hero visual"} 
                    className="h-full w-full object-contain" 
                  />
                )}
              </div>

              {/* Decorative gradient elements */}
              <div className="bg-theme-start absolute -top-4 -right-4 -z-10 h-24 w-24 blur-2xl opacity-30" />
              <div className="bg-theme-end absolute -bottom-4 -left-4 -z-10 h-24 w-24 blur-2xl opacity-30" />
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
