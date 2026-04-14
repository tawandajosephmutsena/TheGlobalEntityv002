"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Ship, Sparkles, Phone } from 'lucide-react';
import type { ContactEtherealInfoBlock } from "@/types/page-blocks";
import { Link } from '@inertiajs/react';

export default function ContactEtherealInfoBlock({
    archive = {
        title: "Our Archive",
        description: "Explore the centuries of scribbled routes and paper secrets found in our Great Library.",
        buttonText: "Browse the Archives",
        buttonLink: "#",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA_Y1LhjakNe8369-Y6kCMdSH5xXxN12oGlhanOil6qyhbZviP8NHZIbYNeNsUUET1bPsIjsK1uLWzrD2eAMM_810D3efqoLMRO31D6jllcCK_ZAtXiE0GbP7un0rBud8wybd4fmgfhgAdaOVq85izMftaGrVzgWasSGZ1novrFhIhELeArou3kDThIfu1wmpdGzsCW_Sh0LG2ojBSN5Kk0SO1Vv2vTfQnCBG3Z09-ACd2zsbGq_nHwrHDsURjV5Z3r8K7rM2orT1wQ"
    },
    directPort = {
        number: "01",
        title: "Direct Port",
        description: "Visit us at the Golden Wharf, Anchor Point VII, The Sapphire Coast."
    },
    instantMagic = {
        title: "Instant Magic"
    },
    voiceFrequency = {
        title: "Voice Frequency",
        description: "Tune your resonator to 432Hz or dial",
        phone: "+1 (800) MAP-SOUL"
    },
    socialTether = {
        title: "Social Tether",
        links: [
            { label: "Ethergram", url: "#" },
            { label: "MapTok", url: "#" },
            { label: "SkyBird", url: "#" }
        ]
    }
}: ContactEtherealInfoBlock['content']) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    const roughEdgeStyle = {
        clipPath: "polygon(0% 2%, 5% 0%, 10% 3%, 15% 1%, 20% 4%, 25% 2%, 30% 5%, 35% 3%, 40% 6%, 45% 4%, 50% 7%, 55% 5%, 60% 8%, 65% 6%, 70% 9%, 75% 7%, 80% 10%, 85% 8%, 90% 11%, 95% 9%, 100% 12%, 100% 88%, 95% 91%, 90% 89%, 85% 92%, 80% 90%, 75% 93%, 70% 91%, 65% 94%, 60% 92%, 55% 95%, 50% 93%, 45% 96%, 40% 94%, 35% 97%, 30% 95%, 25% 98%, 20% 96%, 15% 99%, 10% 97%, 5% 100%, 0% 98%)"
    };

    const parchmentBg = {
        backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')",
        boxShadow: "inset 0 0 100px rgba(0,0,0,0.05), 5px 5px 15px rgba(0,0,0,0.1)"
    };

    return (
        <section className="max-w-[1440px] mx-auto px-6 pt-32 pb-48 bg-background overflow-hidden">
            <motion.div 
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-12 gap-8"
            >
                {/* Archive Card */}
                <motion.div 
                    variants={item}
                    className="col-span-12 md:col-span-6 lg:col-span-5 bg-surface-container p-12 -rotate-1 relative shadow-xl min-h-[450px] flex flex-col justify-end"
                    style={{ ...roughEdgeStyle, ...parchmentBg }}
                >
                    <img 
                        alt="Archive" 
                        className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-multiply dark:mix-blend-screen dark:invert pointer-events-none grayscale" 
                        src={archive.image} 
                    />
                    <div className="relative z-10">
                        <h3 className="font-serif font-black text-5xl text-foreground mb-4">{archive.title}</h3>
                        <p className="text-muted-foreground text-lg max-w-sm mb-6">{archive.description}</p>
                        <Link 
                            href={archive.buttonLink || "#"} 
                            className="inline-flex items-center gap-4 font-serif font-bold text-primary text-sm tracking-[0.2em] border-b-2 border-primary/20 hover:border-primary transition-all"
                        >
                            {archive.buttonText} <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </motion.div>

                {/* Direct Port Card */}
                <motion.div 
                    variants={item}
                    className="col-span-12 md:col-span-6 lg:col-span-3 bg-accent p-12 flex flex-col justify-between text-accent-foreground rotate-2 shadow-2xl relative overflow-hidden h-full min-h-[500px]"
                    style={roughEdgeStyle}
                >
                    <div className="absolute top-0 right-0 p-8 opacity-20">
                        <Ship className="w-32 h-32" />
                    </div>
                    <div className="relative z-10">
                        <span className="font-serif font-black text-8xl block leading-none opacity-20">{directPort.number}</span>
                        <h4 className="font-serif font-bold text-3xl mt-4 tracking-tighter">{directPort.title}</h4>
                    </div>
                    <p className="font-sans text-xl opacity-90 relative z-10">{directPort.description}</p>
                </motion.div>

                {/* Instant Magic Card */}
                <motion.div 
                    variants={item}
                    className="col-span-12 md:col-span-4 lg:col-span-4 bg-secondary p-10 flex flex-col justify-center items-center text-center gap-6 -rotate-3 shadow-lg self-center aspect-square md:aspect-auto text-secondary-foreground"
                    style={roughEdgeStyle}
                >
                    <Sparkles className="text-secondary-foreground/80 w-24 h-24" />
                    <h5 className="font-serif font-bold text-secondary-foreground text-2xl tracking-widest leading-tight">{instantMagic.title}</h5>
                </motion.div>

                {/* Voice Frequency Card */}
                <motion.div 
                    variants={item}
                    className="col-span-12 lg:col-span-7 bg-surface-container-high p-12 flex flex-col md:flex-row items-center gap-12 rotate-1 shadow-xl lg:-mt-12"
                    style={{ ...roughEdgeStyle, ...parchmentBg }}
                >
                    <div className="w-32 h-32 rounded-none -rotate-6 bg-primary flex items-center justify-center shrink-0 shadow-lg border-2 border-primary/30">
                        <Phone className="text-primary-foreground w-16 h-16" />
                    </div>
                    <div>
                        <h4 className="font-serif font-bold text-3xl text-foreground tracking-tight">{voiceFrequency.title}</h4>
                        <p className="text-muted-foreground font-sans mt-4 text-xl">
                            {voiceFrequency.description} <br/>
                            <span className="font-bold text-foreground text-2xl">{voiceFrequency.phone}</span>
                        </p>
                    </div>
                </motion.div>

                {/* Social Tether Card */}
                <motion.div 
                    variants={item}
                    className="col-span-12 lg:col-span-5 bg-surface-container-low p-12 flex flex-col justify-center relative -rotate-2 shadow-2xl overflow-hidden"
                    style={{ ...roughEdgeStyle, ...parchmentBg }}
                >
                    <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-primary/5 rounded-full rotate-45 border border-primary/10"></div>
                    <div className="relative z-10">
                        <h4 className="font-serif font-bold text-xl text-muted-foreground tracking-[0.4em] mb-8">{socialTether.title}</h4>
                        <div className="flex flex-wrap gap-x-12 gap-y-6">
                            {(socialTether.links || []).map((link, idx) => (
                                <Link 
                                    key={idx}
                                    href={link.url}
                                    className="text-foreground hover:text-primary transition-colors font-serif font-black text-2xl italic underline decoration-wavy decoration-foreground/20"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}
