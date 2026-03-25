import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, MessageSquare, Anchor } from 'lucide-react';
import DynamicForm from '@/components/DynamicForm';
import AnimatedSection from '@/components/AnimatedSection';

interface PartnersContactProps {
    title?: string;
    description?: string;
    features?: string[];
    formTitle?: string;
    formDescription?: string;
    submitText?: string;
}

const PartnersContact: React.FC<PartnersContactProps> = ({
    title = "Ready to set sail?",
    description = "Drop us a line to discuss how we can tell your story through the lens of 'The Global Entity'. We are always looking for new horizons to explore together.",
    features = [
        "Custom Editorial Feature",
        "Sustainable Strategy Audit",
        "Community Engagement Plan"
    ],
    formTitle = "Start Your Journey",
    formDescription = "Fill out the parchment below and our dispatchers will reach out to your port of call.",
    submitText = "Dispatch Inquiry"
}) => {
    return (
        <section className="py-32 bg-background overflow-hidden theme-stitch">
            <div className="container mx-auto px-4">
                <div className="bg-surface-container/30 backdrop-blur-3xl text-foreground rounded-[3rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl border border-primary/10">
                    {/* Left Column: Content & Benefits */}
                    <div className="flex-1 p-12 md:p-20 bg-gradient-to-br from-primary/5 to-transparent relative overflow-hidden">
                        {/* Decorative Background Icon */}
                        <div className="absolute -bottom-10 -right-10 opacity-5 -rotate-12 pointer-events-none text-primary">
                            <Anchor size={300} strokeWidth={1} />
                        </div>

                        <AnimatedSection animation="fade-right" className="relative z-10">
                            <h2 className="font-display text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 leading-[0.9] text-on-surface">
                                {title}
                            </h2>
                            <p className="text-xl md:text-2xl text-on-surface-variant mb-12 max-w-lg font-body italic leading-relaxed">
                                {description}
                            </p>

                            <ul className="space-y-6">
                                {features.map((feature, i) => (
                                    <motion.li 
                                        key={i} 
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.8 + (i * 0.1) }}
                                        className="flex items-center gap-4 group"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors duration-500">
                                            <CheckCircle2 size={24} />
                                        </div>
                                        <span className="text-lg font-bold tracking-tight text-on-surface">{feature}</span>
                                    </motion.li>
                                ))}
                            </ul>

                            <div className="mt-16 pt-12 border-t border-primary/10 flex items-center gap-4">
                                <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                                    <MessageSquare size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-on-surface-variant uppercase font-black tracking-widest opacity-60">Average Response</p>
                                    <p className="text-lg font-bold text-on-surface">24-48 Moons</p>
                                </div>
                            </div>
                        </AnimatedSection>
                    </div>

                    {/* Right Column: Form */}
                    <div className="flex-1 p-12 md:p-20 bg-surface-container relative">
                        <AnimatedSection animation="fade-up" delay={400} className="relative z-10 h-full flex flex-col">
                            <div className="mb-10">
                                <h3 className="font-display text-4xl font-black uppercase tracking-tighter mb-3 text-on-surface">{formTitle}</h3>
                                <p className="text-on-surface-variant font-medium">{formDescription}</p>
                            </div>

                            <div className="flex-grow">
                                <DynamicForm 
                                    className="bg-transparent border-none p-0 shadow-none space-y-6"
                                    submitText={submitText}
                                    fields={[
                                        { name: 'name', label: "Captain's Name", type: 'text', required: true, placeholder: 'Explorer Jane' },
                                        { name: 'organization', label: 'Organization / Region', type: 'text', required: true, placeholder: 'Tourism Board of Avalon' },
                                        { name: 'email', label: 'Signal Link (Email)', type: 'email', required: true, placeholder: 'jane@discovery.com' },
                                        { 
                                            name: 'intent', 
                                            label: 'Area of Interest', 
                                            type: 'select', 
                                            required: true, 
                                            placeholder: 'Select your voyage type...',
                                            options: ["Campaign Partnership", "Editorial Feature", "Sustainable Strategy", "Community Project"]
                                        },
                                        { name: 'message', label: 'Your Vision', type: 'textarea', required: true, placeholder: 'Tell us about the untold stories of your shores...' }
                                    ]}
                                />
                            </div>
                        </AnimatedSection>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PartnersContact;
