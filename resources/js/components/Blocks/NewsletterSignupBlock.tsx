"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Mail, Send, Sparkles } from "lucide-react";
import { useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import type { NewsletterSignupBlock as NewsletterSignupBlockType } from "@/types/page-blocks";

export default function NewsletterSignupBlock(props: NewsletterSignupBlockType['content']) {
  const {
    badgeText = "Stay Updated",
    title = "Join our newsletter",
    description = "Get the latest updates, articles, and resources delivered directly to your inbox every week. No spam, unsubscribe anytime.",
    features = ["Weekly updates", "Exclusive content", "Early access"],
    placeholderText = "Enter your email",
    buttonText = "Subscribe",
    footerText = "By subscribing, you agree to our Privacy Policy",
    successTitle = "You're all set!",
    successDescription = "Check your inbox to confirm your subscription",
    trustIndicatorNumber = "10,000+",
    trustIndicatorText = "subscribers already getting our updates"
  } = props;

  const { props: pageProps } = usePage();
  const globalStats = (pageProps as any).global_stats;
  
  // Dynamic trust indicator based on total users
  const displayTrustNumber = globalStats 
    ? `${globalStats.explorers_total.toLocaleString()}+` 
    : trustIndicatorNumber;

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const { data, setData, post, processing, reset } = useForm({
    email: "",
    form_title: "Newsletter signup",
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
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
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

            {/* Right side - Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col justify-center"
            >
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    <div className="relative">
                      <motion.div
                        animate={
                          isFocused
                            ? {
                                scale: 1.02,
                                boxShadow: "0 0 0 3px rgba(var(--primary), 0.1)",
                              }
                            : { scale: 1 }
                        }
                        transition={{ duration: 0.2 }}
                        className="rounded-md"
                      >
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            type="email"
                            placeholder={placeholderText}
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            className="pl-10"
                            disabled={processing}
                            required
                          />
                        </div>
                      </motion.div>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="group w-full"
                      disabled={!data.email || processing}
                    >
                      <span className="font-black tracking-tighter">
                        {processing ? "Submitting..." : buttonText}
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
                        <Send className="h-4 w-4" />
                      </motion.div>
                    </Button>

                    {footerText && (
                      <p className="text-center text-xs text-muted-foreground">
                        {footerText}
                      </p>
                    )}
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center space-y-4 py-8"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, rotate: 360 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                      }}
                      className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
                    >
                      <Check className="h-8 w-8 text-primary" />
                    </motion.div>

                    <div className="text-center">
                      <h3 className="mb-2 text-xl font-black tracking-tighter">
                        {successTitle}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {successDescription}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
            {trustIndicatorNumber && trustIndicatorText && (
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
