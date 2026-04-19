"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import type { EditorialCtaBlock as EditorialCtaBlockType } from "@/types/page-blocks";

export default function EditorialCtaBlock(props: EditorialCtaBlockType['content']) {
  const {
    badgeText = "Join the Movement",
    title = "Ready to start your journey?",
    description = "Join a global community of explorers and creators. Discover unique experiences and connect with like-minded individuals across the world.",
    features = ["Community Access", "Exclusive Events", "Global Network"],
    buttonText = "Get Started",
    buttonLink = "/register",
    footerText = "No commitment required, join thousands of others already exploring.",
    trustIndicatorNumber = "10,000+",
    trustIndicatorText = "active explorers and growing"
  } = props;

  const { props: pageProps } = usePage();
  const globalStats = (pageProps as any).global_stats;
  
  // Dynamic trust indicator based on total users if available
  const displayTrustNumber = globalStats 
    ? `${globalStats.explorers_total.toLocaleString()}+` 
    : trustIndicatorNumber;

  return (
    <section className="relative w-full overflow-visible px-4 py-16">
      <div className="relative mx-auto max-w-4xl">
        <Card className="overflow-hidden liquid-glass shadow-2xl">
          <div className="grid gap-8 p-8 md:grid-cols-2 md:p-12">
            {/* Left side - Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col justify-center"
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
              >
                {badgeText && (
                  <Badge className="mb-4 w-fit bg-primary/20 text-primary border-primary/30 font-black tracking-widest py-1.5 px-4" variant="outline">
                    <Sparkles className="mr-1 h-3 w-3" />
                    {badgeText}
                  </Badge>
                )}
              </motion.div>

              {title && (
                <h2 className="mb-4 text-3xl font-display font-black tracking-tighter md:text-4xl">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mb-6 text-muted-foreground">
                  {description}
                </p>
              )}

              {features && features.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <Badge variant="outline" className="gap-1">
                        <Check className="h-3 w-3 text-primary" />
                        {feature}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Right side - CTA Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col justify-center items-center md:items-start"
            >
              <div className="w-full space-y-6">
                <Link href={buttonLink}>
                  <Button
                    size="lg"
                    className="group w-full py-8 text-xl"
                  >
                    <span className="font-black tracking-tighter uppercase">
                      {buttonText}
                    </span>
                    <motion.div
                      className="ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "easeInOut",
                      }}
                    >
                      <ArrowRight className="h-6 w-6" />
                    </motion.div>
                  </Button>
                </Link>

                {footerText && (
                  <p className="text-center md:text-left text-xs text-muted-foreground italic">
                    {footerText}
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </Card>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-muted-foreground">
            {displayTrustNumber && trustIndicatorText && (
              <>
                Join{" "}
                <motion.span
                  className="font-semibold text-foreground"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
                >
                  {displayTrustNumber}
                </motion.span>{" "}
                {trustIndicatorText}
              </>
            )}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
