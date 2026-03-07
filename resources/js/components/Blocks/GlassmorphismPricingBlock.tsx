"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import type { GlassmorphismPricingBlock as BlockType } from '@/types/page-blocks';
import AnimatedSection from '../AnimatedSection';

export default function GlassmorphismPricingBlock({ title, subtitle, plans = [] }: BlockType['content']) {
  return (
    <AnimatedSection className="px-6 py-32 relative overflow-hidden">
      {/* Decorative gradient blob for glassmorphism effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/20 blur-[120px] opacity-50 dark:opacity-20 pointer-events-none" />
      
      <div className="mx-auto max-w-7xl relative z-10">
        <div className="mb-20 space-y-5 text-center">
          {title && (
            <h2 className="text-5xl font-bold tracking-tight md:text-6xl">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid items-start gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`border p-10 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 ${
                plan.popular
                  ? "border-border bg-background shadow-2xl md:scale-105"
                  : "border-border/50 bg-background/50 hover:border-border"
              }`}
            >
              {plan.popular && (
                <div className="mb-6 inline-block rounded-full bg-foreground px-3 py-1 text-xs font-semibold tracking-wide text-background">
                  MOST POPULAR
                </div>
              )}
              <h3 className="mb-3 text-2xl font-bold tracking-tight">
                {plan.name}
              </h3>
              <div className="mb-6">
                <span className="text-5xl font-bold tracking-tight">
                  {plan.price}
                </span>
                {plan.price !== "Custom" && (
                  <span className="text-lg text-muted-foreground">/month</span>
                )}
              </div>
              <p className="mb-8 text-base leading-relaxed text-muted-foreground">
                {plan.description}
              </p>
              <Button
                asChild
                className={`mb-8 h-11 w-full rounded-full text-base ${plan.popular ? "" : "hover:bg-foreground/5"}`}
                variant={plan.popular ? "default" : "outline"}
              >
                <a href={plan.buttonLink || '#'}>{plan.buttonText || 'Get Started'}</a>
              </Button>
              <ul className="space-y-4">
                {plan.features?.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-foreground/[0.08]">
                      <Check className="h-3 w-3 text-foreground" />
                    </div>
                    <span className="text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
