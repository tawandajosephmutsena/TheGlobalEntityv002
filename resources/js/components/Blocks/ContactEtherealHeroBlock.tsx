"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles } from 'lucide-react';
import type { ContactEtherealHeroBlock } from "@/types/page-blocks";

export default function ContactEtherealHeroBlock({
    badgeText = "The Ethereal Portal",
    titleLine1 = "Cast Your Message",
    titleLine2Highlight = "into the Wind",
    description = "Whether you're seeking a hidden archipelago or a festival of the souls, our cartographers are ready to map your next transcendence.",
    sideImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuD3MPhbeuxREb4eJln4yYOVBgx1uF88ogHQm0eWUbEEanTR-UnGiya-UHi05uHteDZsSy6gtWA8MS31vTFjZpESPhgaWbJul2Zl4__-rqWDQWDsGQP-Jpjxd9Z-DT2AoiWd_SGdArbHhsppLcnPLfrK6zoU-8wowljSrosHAa9B9AIjy4ZUFm91kHKJUNua7JuaTAxo2u5LbO9Frg2k8uF0XnOdDlo1x4Ne10usajYwWJP2x_h_mRJyoZlsqK1nuM7t2Z2k5qNEx3-5",
    sideImageAlt = "Ancient Sketch",
    formSubmitText = "Send to the Ether",
    formEtaText = "Est. Time of Arrival: 2-3 Solar Cycles",
    labels = {
        name: "Navigator Name",
        email: "Email Address",
        message: "Your Expedition Inquiry"
    },
    placeholders = {
        name: "e.g. Captain Lyra Dawn",
        email: "correspondence@beyond.map",
        message: "Describe the coordinates of your imagination..."
    }
}: ContactEtherealHeroBlock['content']) {
    return (
        <section className="relative pt-48 pb-24 overflow-hidden bg-background text-foreground selection:bg-primary/20 selection:text-primary-foreground">
            {/* Parchment Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] shadow-[inset_0_0_100px_rgba(0,0,0,0.05)]" />
            
            {/* Background Decorative Graphic */}
            <div className="absolute top-20 right-[-10%] w-[600px] h-[800px] opacity-10 dark:opacity-20 rotate-12 pointer-events-none">
                <img 
                    alt="Ancient Chart" 
                    className="w-full h-full object-contain grayscale dark:invert" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_Y1LhjakNe8369-Y6kCMdSH5xXxN12oGlhanOil6qyhbZviP8NHZIbYNeNsUUET1bPsIjsK1uLWzrD2eAMM_810D3efqoLMRO31D6jllcCK_ZAtXiE0GbP7un0rBud8wybd4fmgfhgAdaOVq85izMftaGrVzgWasSGZ1novrFhIhELeArou3kDThIfu1wmpdGzsCW_Sh0LG2ojBSN5Kk0SO1Vv2vTfQnCBG3Z09-ACd2zsbGq_nHwrHDsURjV5Z3r8K7rM2orT1wQ" 
                />
            </div>

            <div className="max-w-[1440px] mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                    
                    {/* Left Column: Content */}
                    <div className="lg:col-span-7 space-y-12">
                        <motion.div 
                            initial={{ opacity: 0, x: -20, rotate: -3 }}
                            whileInView={{ opacity: 1, x: 0, rotate: -2 }}
                            viewport={{ once: true }}
                            className="relative inline-block"
                        >
                            <div className="bg-accent/10 px-4 py-2 border-b-2 border-accent/30">
                                <span className="font-serif font-bold uppercase text-xs tracking-[0.3em] text-accent">{badgeText}</span>
                            </div>
                        </motion.div>

                        <div className="relative">
                            <motion.h1 
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-6xl md:text-8xl lg:text-9xl font-black font-serif text-foreground leading-tight tracking-tighter"
                            >
                                {titleLine1} <br/>
                                <span className="text-primary italic underline decoration-wavy decoration-primary/30">
                                    {titleLine2Highlight}
                                </span>
                            </motion.h1>
                        </div>

                        <motion.div 
                            initial={{ opacity: 0, y: 20, rotate: 0 }}
                            whileInView={{ opacity: 1, y: 0, rotate: 0.5 }}
                            viewport={{ once: true }}
                            className="relative bg-card/40 backdrop-blur-sm p-8 border-l-4 border-primary/20 max-w-2xl"
                        >
                            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-sans">
                                {description}
                            </p>
                        </motion.div>

                        {/* Image Frame with Rough Edge Effect */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, rotate: 1 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: -1 }}
                            viewport={{ once: true }}
                            className="relative w-full aspect-video bg-slate-200 shadow-2xl overflow-hidden group ethereal-rough-edge"
                        >
                            <img 
                                alt={sideImageAlt} 
                                className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply dark:mix-blend-screen dark:invert transition-transform duration-700 group-hover:scale-105" 
                                src={sideImage} 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
                            <div className="absolute bottom-8 left-8 bg-card p-4 border border-border shadow-lg">
                                <span className="font-serif font-bold text-xs uppercase tracking-widest text-card-foreground">Live Signal: Navigator's Outpost</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="lg:col-span-5 relative">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="absolute -inset-4 bg-accent/5 rotate-3 -z-10 ethereal-rough-edge"
                        ></motion.div>
                        
                        <motion.div 
                            initial={{ opacity: 0, y: 40, rotate: 0 }}
                            whileInView={{ opacity: 1, y: 0, rotate: 1.5 }}
                            viewport={{ once: true }}
                            className="p-10 md:p-14 bg-card dark:bg-card/90 border border-border shadow-2xl relative bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] ethereal-rough-edge"
                        >
                            <motion.div 
                                animate={{ rotate: [12, 15, 12] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute -top-6 -right-6 w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center border-4 border-dashed border-primary/30"
                            >
                                <Sparkles className="text-primary h-10 w-10" />
                            </motion.div>

                            <form action="#" className="space-y-10" onSubmit={(e) => e.preventDefault()}>
                                <div className="space-y-4">
                                    <Label className="font-serif font-bold text-xs uppercase tracking-widest text-primary block border-b border-primary/20 pb-1">
                                        {labels.name}
                                    </Label>
                                    <Input 
                                        className="w-full bg-transparent border-0 border-b-2 border-border focus-visible:ring-0 focus-visible:border-primary px-0 py-2 font-sans text-xl text-foreground placeholder:text-muted-foreground/30 rounded-none h-auto transition-colors" 
                                        placeholder={placeholders.name} 
                                        type="text" 
                                    />
                                </div>
                                <div className="space-y-4">
                                    <Label className="font-serif font-bold text-xs uppercase tracking-widest text-primary block border-b border-primary/20 pb-1">
                                        {labels.email}
                                    </Label>
                                    <Input 
                                        className="w-full bg-transparent border-0 border-b-2 border-border focus-visible:ring-0 focus-visible:border-primary px-0 py-2 font-sans text-xl text-foreground placeholder:text-muted-foreground/30 rounded-none h-auto transition-colors" 
                                        placeholder={placeholders.email} 
                                        type="email" 
                                    />
                                </div>
                                <div className="space-y-4">
                                    <Label className="font-serif font-bold text-xs uppercase tracking-widest text-primary block border-b border-primary/20 pb-1">
                                        {labels.message}
                                    </Label>
                                    <Textarea 
                                        className="w-full bg-transparent border-0 border-b-2 border-border focus-visible:ring-0 focus-visible:border-primary px-0 py-2 font-sans text-xl text-foreground placeholder:text-muted-foreground/30 min-h-[120px] rounded-none transition-colors overflow-hidden resize-none" 
                                        placeholder={placeholders.message} 
                                        rows={4} 
                                    />
                                </div>
                                <div className="pt-6">
                                    <Button className="w-full py-8 bg-primary hover:bg-primary/90 text-primary-foreground font-serif font-black text-lg tracking-[0.2em] uppercase transition-all shadow-xl rounded-none">
                                        {formSubmitText}
                                    </Button>
                                </div>
                                <div className="text-center italic opacity-40 font-sans text-sm">
                                    {formEtaText}
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
