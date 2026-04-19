import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, MessageSquare, Anchor } from 'lucide-react';
import OnboardingForm, { FormStep } from '@/components/ui/OnboardingForm';
import AnimatedSection from '@/components/AnimatedSection';

interface PartnersContactProps {
    title?: string;
    description?: string;
    features?: string[];
    formTitle?: string;
    formDescription?: string;
    submitText?: string;
    steps?: FormStep[];
    adminEmail?: string;
    replyToEmail?: string;
    confirmationEmailBody?: string;
    successMessage?: string;
    allowMultipleSubmissions?: boolean;
    averageResponseLabel?: string;
    averageResponseValue?: string;
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
    submitText = "Dispatch Inquiry",
    steps,
    adminEmail,
    replyToEmail,
    confirmationEmailBody,
    successMessage,
    allowMultipleSubmissions = true,
    averageResponseLabel = "Average Response",
    averageResponseValue = "24-48 Moons"
}) => {
    // Default steps matching the original hardcoded form if none provided
    const defaultSteps: FormStep[] = [
        {
            id: 'initial',
            title: 'Your Details',
            fields: [
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
            ]
        }
    ];

    const displaySteps = steps && steps.length > 0 ? steps : defaultSteps;

    return (
        <section className="relative py-32 overflow-visible">
            <div className="container mx-auto px-4 relative z-10">
                <div className="liquid-glass text-foreground rounded-[3rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl border border-primary/10">
                    {/* Left Column: Content & Benefits */}
                    <div className="flex-1 p-12 md:p-20 bg-transparent relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-transparent z-[5]" />
                        <div className="absolute -bottom-10 -right-10 opacity-5 -rotate-12 pointer-events-none text-primary">
                            <Anchor size={300} strokeWidth={1} />
                        </div>

                        <AnimatedSection animation="fade-right" className="relative z-10">
                            <h2 className="font-display text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.9] text-on-surface">
                                {title}
                            </h2>
                            <p className="text-xl md:text-2xl text-on-surface-variant mb-12 max-w-lg font-body italic leading-relaxed">
                                {description}
                            </p>

                            <ul className="space-y-6">
                                {features.map((feature, i) => (
                                    <li key={i}>
                                        <motion.div 
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.8 + (i * 0.1) }}
                                            className="flex items-center gap-4 group"
                                        >
                                            <div className="w-16 h-16 liquid-glass text-secondary rounded-full flex items-center justify-center mx-auto shadow-sea-mist ring-8 ring-white/10 transition-all duration-700 group-hover:scale-110 group-hover:rotate-[360deg] z-20 relative">
                                                <CheckCircle2 size={24} />
                                            </div>
                                            <span className="text-lg font-bold tracking-tight text-on-surface">{feature}</span>
                                        </motion.div>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-16 pt-12 border-t border-primary/10 flex items-center gap-4">
                                <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                                    <MessageSquare size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-on-surface-variant font-black tracking-widest opacity-60">
                                        {averageResponseLabel}
                                    </p>
                                    <p className="text-lg font-bold text-on-surface">
                                        {averageResponseValue}
                                    </p>
                                </div>
                            </div>
                        </AnimatedSection>
                    </div>

                    {/* Right Column: Dynamic Multi-Step Form */}
                    <div className="flex-1 p-12 md:p-20 bg-transparent relative flex flex-col">
                        <AnimatedSection animation="fade-up" delay={400} className="relative z-10">
                            <div className="mb-10">
                                <h3 className="font-display text-4xl font-black tracking-tighter mb-3 text-on-surface">{formTitle}</h3>
                                <p className="text-on-surface-variant font-medium">{formDescription}</p>
                            </div>
                        </AnimatedSection>

                        <div className="relative z-10 flex-grow">
                            <div className="partners-contact-form-wrapper">
                                <OnboardingForm 
                                    steps={displaySteps}
                                    submitText={submitText}
                                    adminEmail={adminEmail}
                                    replyToEmail={replyToEmail}
                                    confirmationEmailBody={confirmationEmailBody}
                                    successMessage={successMessage}
                                    allowMultipleSubmissions={allowMultipleSubmissions}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .partners-contact-form-wrapper > div {
                    background: transparent !important;
                    border: none !important;
                    box-shadow: none !important;
                    padding: 0 !important;
                }
                .partners-contact-form-wrapper .card-header {
                    display: none !important;
                }
                .partners-contact-form-wrapper .card-content {
                    padding: 0 !important;
                }
                .partners-contact-form-wrapper .card-footer {
                    padding: 2rem 0 0 0 !important;
                }
                .partners-contact-form-wrapper input, 
                .partners-contact-form-wrapper textarea,
                .partners-contact-form-wrapper .select-trigger {
                    background: rgba(255, 255, 255, 0.03) !important;
                    border: 1px solid rgba(var(--primary-rgb), 0.1) !important;
                    border-radius: 1rem !important;
                    backdrop-filter: blur(10px) !important;
                }
                .partners-contact-form-wrapper label {
                    font-weight: 700 !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.05em !important;
                    font-size: 0.75rem !important;
                    opacity: 0.7 !important;
                    margin-bottom: 0.5rem !important;
                }
            `}} />
        </section>
    );
};

export default PartnersContact;
