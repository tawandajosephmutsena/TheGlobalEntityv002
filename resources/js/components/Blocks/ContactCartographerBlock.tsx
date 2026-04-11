import React, { useEffect, useRef, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { 
    Users, 
    Handshake, 
    Newspaper, 
    Map as MapIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import DynamicForm from '@/components/DynamicForm';
import AnimatedSection from '@/components/AnimatedSection';

// Lazy-load the 3D globe to avoid SSR issues and reduce initial bundle
const Globe3D = lazy(() => import('@/components/ui/3d-globe').then(m => ({ default: m.Globe3D })));

import type { GlobeMarker } from '@/components/ui/3d-globe';

const globeMarkers: GlobeMarker[] = [
    { lat: 40.7128, lng: -74.006, src: "https://assets.aceternity.com/avatars/1.webp", label: "New York" },
    { lat: 51.5074, lng: -0.1278, src: "https://assets.aceternity.com/avatars/2.webp", label: "London" },
    { lat: 35.6762, lng: 139.6503, src: "https://assets.aceternity.com/avatars/3.webp", label: "Tokyo" },
    { lat: -33.8688, lng: 151.2093, src: "https://assets.aceternity.com/avatars/4.webp", label: "Sydney" },
    { lat: 48.8566, lng: 2.3522, src: "https://assets.aceternity.com/avatars/5.webp", label: "Paris" },
    { lat: 28.6139, lng: 77.209, src: "https://assets.aceternity.com/avatars/6.webp", label: "New Delhi" },
    { lat: 55.7558, lng: 37.6173, src: "https://assets.aceternity.com/avatars/7.webp", label: "Moscow" },
    { lat: -22.9068, lng: -43.1729, src: "https://assets.aceternity.com/avatars/8.webp", label: "Rio de Janeiro" },
    { lat: 31.2304, lng: 121.4737, src: "https://assets.aceternity.com/avatars/9.webp", label: "Shanghai" },
    { lat: 25.2048, lng: 55.2708, src: "https://assets.aceternity.com/avatars/10.webp", label: "Dubai" },
    { lat: -34.6037, lng: -58.3816, src: "https://assets.aceternity.com/avatars/11.webp", label: "Buenos Aires" },
    { lat: 1.3521, lng: 103.8198, src: "https://assets.aceternity.com/avatars/12.webp", label: "Singapore" },
    { lat: 37.5665, lng: 126.978, src: "https://assets.aceternity.com/avatars/13.webp", label: "Seoul" },
];

interface InquiryCard {
    id: string;
    icon: string;
    title: string;
    description: string;
    color: 'primary' | 'secondary' | 'tertiary';
}

interface ContactCartographerBlockProps {
    heroTitle?: string;
    heroTitleHighlight?: string;
    heroDescription?: string;
    infoTitle?: string;
    infoDescription?: string;
    inquiryCards?: InquiryCard[];
    formTitle?: string;
    formDescription?: string;
    formSubmitText?: string;
    formSuccessMessage?: string;
    formAdminEmail?: string;
    subjects?: string[];
}

const iconMap: Record<string, React.ReactNode> = {
    groups: <Users className="size-6" />,
    handshake: <Handshake className="size-6" />,
    newspaper: <Newspaper className="size-6" />,
    explore: <MapIcon className="size-6" />,
};

const ContactCartographerBlock: React.FC<ContactCartographerBlockProps> = ({
    heroTitle = "Say Hello",
    heroTitleHighlight = ".",
    heroDescription = "Welcome to The Cartographer's Desk. Let's map out our next journey together. Reach out for community, partnerships, or press inquiries. We read every message like a message in a bottle.",
    infoTitle = "Direct your message",
    infoDescription = "Select the right desk for your inquiry to ensure it reaches the right mapmaker.",
    inquiryCards = [
        { id: '1', icon: 'groups', title: 'Community', description: 'Connect with fellow mapmakers, share your routes, and join our expeditions.', color: 'tertiary' },
        { id: '2', icon: 'handshake', title: 'Partnerships', description: 'Collaborate with us on new cartographic projects, sponsorships, and gear testing.', color: 'secondary' },
        { id: '3', icon: 'newspaper', title: 'Press & Media', description: 'Access media kits, high-resolution imagery, press releases, and editorial resources for publication.', color: 'primary' },
    ],
    formTitle = "Send a Message",
    formDescription = "Fill out the fields below to dispatch your inquiry.",
    formSubmitText = "Dispatch Message",
    formSuccessMessage = "Your message has been dispatched to our mapmakers!",
    formAdminEmail,
    subjects = ["General Inquiry", "Community Join", "Partnership Proposal", "Press Request"]
}) => {
    const mapIconRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (mapIconRef.current) {
            gsap.to(mapIconRef.current, {
                rotation: -12,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut"
            });
        }
    }, []);

    return (
        <section className="relative min-h-screen bg-background text-on-background overflow-hidden font-body py-12 lg:py-24 px-4 md:px-10 lg:px-40">
            {/* Ambient Watercolor Backgrounds */}
            <motion.div 
                animate={{ 
                    scale: [1, 1.1, 1],
                    x: [0, 20, 0],
                    y: [0, -20, 0]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute top-[-10%] left-[-5%] bg-primary/20 dark:bg-primary/10 rounded-full blur-[80px] w-[500px] h-[500px] pointer-events-none z-0" 
            />
            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1],
                    x: [0, -30, 0],
                    y: [0, 20, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[10%] right-[-10%] bg-tertiary/20 dark:bg-tertiary/10 rounded-full blur-[100px] w-[600px] h-[600px] pointer-events-none z-0" 
            />

            <div className="relative z-10 max-w-[1440px] mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
                    
                    {/* Left Column: Editorial Hero + Globe */}
                    <div className="lg:col-span-5 flex flex-col gap-8 relative lg:sticky lg:top-24">
                        <div ref={mapIconRef} className="absolute -top-10 -left-10 text-muted-foreground/20 z-0">
                            <MapIcon size={120} strokeWidth={1} />
                        </div>
                        
                        <AnimatedSection animation="fade-right" className="relative z-10">
                            <h1 className="font-headline text-6xl md:text-7xl font-black leading-tight tracking-tighter mb-6">
                                {heroTitle}<span className="text-primary">{heroTitleHighlight}</span>
                            </h1>
                            <p className="text-muted-foreground text-lg md:text-xl font-normal leading-relaxed max-w-md">
                                {heroDescription}
                            </p>
                            
                            <div className="h-8 w-32 bg-muted rounded-full relative overflow-hidden mt-8">
                                <motion.div 
                                    animate={{ left: ["-100%", "100%"] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute top-0 h-full w-1/3 bg-tertiary/40 rounded-full" 
                                />
                            </div>
                        </AnimatedSection>

                        {/* 3D Globe */}
                        <AnimatedSection animation="fade-up" delay={300} className="relative z-10">
                            <div className="relative flex items-center justify-center aspect-square max-w-[480px] mx-auto">
                                <Suspense fallback={
                                    <div className="flex items-center justify-center h-full w-full aspect-square">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 rounded-full border-2 border-muted-foreground/20 border-t-primary animate-spin" />
                                            <span className="text-sm text-muted-foreground">Loading globe...</span>
                                        </div>
                                    </div>
                                }>
                                    <Globe3D
                                        markers={globeMarkers}
                                        className="w-full h-full aspect-square"
                                        config={{
                                            bumpScale: 3,
                                            autoRotateSpeed: 0.3,
                                            showAtmosphere: false,
                                            enableZoom: false,
                                            enablePan: false,
                                            backgroundColor: null,
                                            ambientIntensity: 1.2,
                                            pointLightIntensity: 2.0,
                                        }}
                                    />
                                </Suspense>
                            </div>
                        </AnimatedSection>
                    </div>

                    {/* Right Column: Bento Grid & Form */}
                    <div className="lg:col-span-7 flex flex-col gap-12">
                        
                        {/* Inquiries Bento Grid */}
                        <AnimatedSection animation="fade-up" delay={200} className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <h2 className="font-headline text-3xl font-bold leading-tight">{infoTitle}</h2>
                                <p className="text-muted-foreground text-base">{infoDescription}</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {inquiryCards.map((card, idx) => (
                                    <motion.div 
                                        key={card.id}
                                        whileHover={{ y: -5 }}
                                        className={cn(
                                            "relative p-6 flex flex-col gap-4 group cursor-pointer overflow-hidden rounded-[2rem] bg-card border border-border shadow-sm",
                                            idx === inquiryCards.length - 1 && inquiryCards.length % 2 !== 0 && "md:col-span-2"
                                        )}
                                    >
                                        <div className={cn(
                                            "absolute top-0 right-0 w-24 h-24 opacity-20 rounded-bl-full transform translate-x-1/2 -translate-y-1/2 transition-transform group-hover:scale-150",
                                            card.color === 'primary' ? "bg-primary" : card.color === 'secondary' ? "bg-secondary" : "bg-tertiary"
                                        )} />
                                        
                                        <div className={cn(
                                            "h-12 w-12 rounded-full bg-muted flex items-center justify-center relative z-10",
                                            card.color === 'primary' ? "text-primary" : card.color === 'secondary' ? "text-secondary" : "text-tertiary"
                                        )}>
                                            {iconMap[card.icon] || <MapIcon className="size-6" />}
                                        </div>
                                        
                                        <div className="flex flex-col gap-2 relative z-10">
                                            <h3 className="font-headline text-xl font-bold">{card.title}</h3>
                                            <p className="text-muted-foreground text-sm leading-relaxed">
                                                {card.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </AnimatedSection>

                        {/* Contact Form Area */}
                        <AnimatedSection animation="fade-up" delay={400}>
                            <div className="bg-muted/30 dark:bg-muted/10 rounded-[2.5rem] p-6 md:p-8 lg:p-12 border border-border/50 shadow-inner relative overflow-hidden">
                                <div className="flex flex-col gap-2 mb-8">
                                    <h2 className="font-headline text-2xl font-bold leading-tight">{formTitle}</h2>
                                    <p className="text-muted-foreground text-sm">{formDescription}</p>
                                </div>
                                
                                <DynamicForm 
                                    className="bg-transparent border-none p-0 shadow-none dark:bg-transparent"
                                    submitText={formSubmitText}
                                    successMessage={formSuccessMessage}
                                    adminEmail={formAdminEmail}
                                    fields={[
                                        { name: 'name', label: 'Your Name', type: 'text', required: true, placeholder: 'Jane Doe' },
                                        { name: 'email', label: 'Email Address', type: 'email', required: true, placeholder: 'jane@example.com' },
                                        { 
                                            name: 'subject', 
                                            label: 'Subject', 
                                            type: 'select', 
                                            required: true, 
                                            placeholder: 'Select an inquiry area...',
                                            options: subjects
                                        },
                                        { name: 'message', label: 'Your Message', type: 'textarea', required: true, placeholder: 'Tell us about your journey...' }
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

export default ContactCartographerBlock;
