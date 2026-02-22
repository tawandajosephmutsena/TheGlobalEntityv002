"use client";

import React, { useEffect } from "react";
import { Link } from "@inertiajs/react";
import { useAnimate } from "framer-motion";
import { Mail, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { HighlighterItem, HighlightGroup, Particles } from "@/components/ui/highlighter";
import AnimatedSection from "@/components/AnimatedSection";

interface ConnectBlockProps {
  title?: string;
  description?: string;
  labels?: string[];
  pointerLabel?: string;
  ctaText?: string;
  ctaHref?: string;
  email?: string;
  whatsapp?: string;
}

export default function ConnectBlock({
  title = "Any questions about Design?",
  description = "Feel free to reach out to me!",
  labels = ["UI-UX", "Graphic Design", "Web Application", "Branding"],
  pointerLabel = "Ali",
  ctaText = "Book a call",
  ctaHref = "#",
  email = "contact@example.com",
  whatsapp = "1234567890",
}: ConnectBlockProps) {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (!scope.current) return;

    animate(
      [
        ["#pointer", { left: "60%", top: "20%" }, { duration: 0 }],
        ["#label-0", { opacity: 1 }, { duration: 0.3 }],
        [
          "#pointer",
          { left: "15%", top: "35%" },
          { at: "+0.5", duration: 0.5, ease: "easeInOut" },
        ],
        ["#label-0", { opacity: 0.4 }, { at: "-0.3", duration: 0.1 }],
        ["#label-1", { opacity: 1 }, { duration: 0.3 }],
        [
          "#pointer",
          { left: "70%", top: "60%" },
          { at: "+0.5", duration: 0.5, ease: "easeInOut" },
        ],
        ["#label-1", { opacity: 0.4 }, { at: "-0.3", duration: 0.1 }],
        ["#label-2", { opacity: 1 }, { duration: 0.3 }],
        [
          "#pointer",
          { left: "25%", top: "70%" },
          { at: "+0.5", duration: 0.5, ease: "easeInOut" },
        ],
        ["#label-2", { opacity: 0.4 }, { at: "-0.3", duration: 0.1 }],
        ["#label-3", { opacity: 1 }, { duration: 0.3 }],
        [
          "#pointer",
          { left: "60%", top: "20%" },
          { at: "+0.5", duration: 0.5, ease: "easeInOut" },
        ],
        ["#label-3", { opacity: 0.5 }, { at: "-0.3", duration: 0.1 }],
      ],
      {
        repeat: Number.POSITIVE_INFINITY,
      }
    );
  }, [animate, scope]);

  return (
    <AnimatedSection className="relative mx-auto mb-20 mt-6 max-w-7xl px-4 lg:px-0">
      <HighlightGroup className="group h-full">
        <div className="group/item h-full w-full">
          <HighlighterItem className="rounded-3xl p-px">
            <div className="relative z-20 h-full overflow-hidden rounded-3xl border border-border bg-background dark:bg-black/50 backdrop-blur-sm">
              <Particles
                className="absolute inset-0 -z-10 opacity-10 transition-opacity duration-1000 ease-in-out group-hover/item:opacity-40"
                quantity={200}
                color={"#888888"}
                vy={-0.2}
              />
              <div className="flex justify-center">
                <div className="flex w-full flex-col justify-center gap-10 p-8 md:p-16 md:h-[500px] md:flex-row md:items-center">
                  <div
                    className="relative mx-auto h-[270px] w-full max-w-[300px] md:h-[400px] md:max-w-[450px] md:flex-1"
                    ref={scope}
                  >
                    {/* Logo/Icon Placeholder */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="h-16 w-16 rounded-full bg-agency-accent/20 flex items-center justify-center animate-pulse">
                            <div className="h-8 w-8 rounded-full bg-agency-accent shadow-[0_0_20px_rgba(var(--agency-accent-rgb),0.4)]" />
                        </div>
                    </div>

                    {labels.map((label, index) => (
                        <div
                            key={index}
                            id={`label-${index}`}
                            className={cn(
                                "absolute rounded-3xl border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium opacity-50 shadow-sm transition-all dark:bg-slate-800/80 whitespace-nowrap",
                                index === 0 && "bottom-[20%] left-[5%]",
                                index === 1 && "left-0 top-[25%]",
                                index === 2 && "bottom-[25%] right-[5%]",
                                index === 3 && "right-[10%] top-[10%]"
                            )}
                        >
                            {label}
                        </div>
                    ))}

                    <div id="pointer" className="absolute z-30 flex items-center gap-2 pointer-events-none">
                      <svg
                        width="16"
                        height="18"
                        viewBox="0 0 12 13"
                        className="fill-agency-accent drop-shadow-[0_0_8px_rgba(var(--agency-accent-rgb),0.5)]"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 5.50676L0 0L2.83818 13L6.30623 7.86537L12 5.50676V5.50676Z"
                        />
                      </svg>
                      <span className="bg-agency-accent rounded-full px-2.5 py-1 text-[10px] font-bold text-white shadow-lg">
                        {pointerLabel}
                      </span>
                    </div>
                  </div>

                  <div className="flex h-full flex-col justify-center text-center md:text-left md:flex-1">
                    <h3 className="text-3xl font-bold tracking-tight md:text-5xl lg:text-7xl leading-tight">
                      {title}
                    </h3>
                    <p className="mt-6 text-muted-foreground text-lg md:text-xl">
                      {description}
                    </p>
                    <div className="mt-10 flex flex-wrap justify-center gap-4 md:justify-start">
                      {ctaHref.startsWith('http') || ctaHref.startsWith('#') || ctaHref.startsWith('mailto') ? (
                          <a
                            href={ctaHref}
                            className={cn(buttonVariants({ size: "lg" }), "rounded-full font-bold px-10 h-14 text-lg")}
                          >
                            {ctaText}
                          </a>
                      ) : (
                          <Link
                            href={ctaHref}
                            className={cn(buttonVariants({ size: "lg" }), "rounded-full font-bold px-10 h-14 text-lg")}
                          >
                            {ctaText}
                          </Link>
                      )}
                      
                      {email && (
                        <a
                            href={`mailto:${email}`}
                            aria-label="Send an email"
                            title="Send an email"
                            className={cn(
                            buttonVariants({
                                variant: "outline",
                                size: "icon",
                            }),
                            "rounded-full h-12 w-12 inline-flex items-center justify-center shrink-0"
                            )}
                        >
                            <Mail className="h-5 w-5" />
                        </a>
                      )}

                      {whatsapp && (
                        <a
                            href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Send a WhatsApp message"
                            title="Send a WhatsApp message"
                            className={cn(
                            buttonVariants({
                                variant: "outline",
                                size: "icon",
                            }),
                            "rounded-full h-12 w-12 inline-flex items-center justify-center shrink-0"
                            )}
                        >
                            <MessageCircle className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </HighlighterItem>
        </div>
      </HighlightGroup>
    </AnimatedSection>
  );
}
