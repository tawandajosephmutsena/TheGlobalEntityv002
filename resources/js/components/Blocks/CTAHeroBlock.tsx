"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Sparkles, Zap } from "lucide-react";
import { useState } from "react";
import { Link } from "@inertiajs/react";
import type { CTAHeroBlock } from "@/types/page-blocks";

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
  const [email, setEmail] = useState("");

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background px-4 pt-48 pb-32">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="bg-primary/10 absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -120, 0],
            y: [0, 80, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] -right-[5%] h-[35%] w-[35%] rounded-full bg-purple-500/10 blur-[100px]"
        />
      </div>

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
                <span className="text-primary relative inline-block">
                  {titleHighlight}
                  <svg
                    className="absolute -bottom-2 left-0 -z-10 h-3 w-full text-primary/20"
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
              <div className="relative flex flex-col gap-3 sm:flex-row">
                <Input
                  type="email"
                  placeholder={emailPlaceholder}
                  className="h-12 border-primary/20 bg-background/50 focus-visible:ring-primary backdrop-blur-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button className="group h-12 px-8" asChild>
                    <Link href={buttonLink}>
                        {buttonText}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </Button>
              </div>

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
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-background bg-muted"
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

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 -z-10 h-24 w-24 bg-primary/20 blur-2xl" />
              <div className="absolute -bottom-4 -left-4 -z-10 h-24 w-24 bg-purple-500/20 blur-2xl" />
            </div>

            {/* Floating Badge */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="bg-background/90 absolute -bottom-6 -left-6 rounded-2xl border p-4 shadow-xl backdrop-blur-md sm:-bottom-8 sm:-left-8"
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/20 flex h-10 w-10 items-center justify-center rounded-xl">
                  <Zap className="text-primary h-6 w-6" />
                </div>
                <div>
                    <div className="text-sm font-bold">Real-time Sync</div>
                    <div className="text-muted-foreground text-xs font-medium">Auto-saving active</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
