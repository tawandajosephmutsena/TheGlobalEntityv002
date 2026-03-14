import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import { motion } from 'framer-motion';
import { 
    Calendar, 
    MapPin, 
    ExternalLink, 
    ChevronLeft, 
    Share2, 
    Heart,
    Star,
    Users,
    Activity,
    CheckCircle2,
    ImageIcon
} from 'lucide-react';
import { Map, MapMarker, MapControls, MarkerContent, MarkerPopup } from '@/components/ui/map';
import { Button } from '@/components/ui/button';
import { ReviewSection } from '@/components/Sections/ReviewSection';

interface Festival {
    id: number;
    title: string;
    description: string;
    category: string;
    image: string | null;
    gallery: string[];
    date: string;
    end_date: string;
    location: {
        address: string;
        lat: string;
        lng: string;
    } | null;
    activities: string[];
    social_tags: string[];
    author: {
        name: string;
        avatar: string;
    };
    reviews: Array<{
        id: number;
        user: {
            name: string;
            avatar: string;
        };
        body: string;
        vibe_rating: number;
        safety_rating: number;
        sustainability_rating: number;
        date: string;
    }>;
}

interface Props {
    festival: Festival;
}

export default function Show({ festival }: Props) {
    const [liked, setLiked] = useState(false);



    const lat = festival.location?.lat ? parseFloat(festival.location.lat) : 51.505;
    const lng = festival.location?.lng ? parseFloat(festival.location.lng) : -0.09;
    const center: [number, number] = [lng, lat];

    return (
        <MainLayout>
            <Head title={festival.title} />

            <div className="min-h-screen selection:bg-primary/30">
                {/* Hero Section - Redesigned for better "fit" */}
                <div className="relative h-[70vh] w-full overflow-hidden">
                    <motion.div 
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute inset-0"
                    >
                        {festival.image ? (
                            <img 
                                src={festival.image} 
                                alt={festival.title}
                                className="w-full h-full object-cover object-center"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-secondary/50 to-primary/20 flex items-center justify-center">
                                <ImageIcon size={64} className="text-white/20" />
                            </div>
                        )}
                        {/* More sophisticated gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-transparent" />
                </motion.div>

                    <div className="absolute inset-0 flex flex-col justify-end px-6 pb-20">
                        <div className="max-w-7xl mx-auto w-full">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="flex flex-wrap items-center gap-3 mb-6"
                            >
                                <span className="px-4 py-1.5 rounded-full bg-primary text-black text-sm font-semibold tracking-wide uppercase">
                                    {festival.category}
                                </span>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
                                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                    <span className="text-xs font-medium text-white/90">Featured Event</span>
                                </div>
                            </motion.div>

                            <motion.h1 
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                                className="text-6xl md:text-8xl font-display font-bold mb-8 leading-[0.9] tracking-tighter text-foreground"
                            >
                                {festival.title}
                            </motion.h1>

                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.9 }}
                                className="flex flex-wrap items-center gap-8 text-muted-foreground"
                            >
                                <div className="flex items-center gap-3">
                                    <Calendar size={20} className="text-primary" />
                                    <span className="text-lg">{festival.date} {festival.end_date ? `- ${festival.end_date}` : ''}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin size={20} className="text-primary" />
                                    <span className="text-lg">{festival.location?.address ?? 'Secret Location'}</span>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="max-w-7xl mx-auto px-6 py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                        {/* Left Column: Description & Gallery */}
                        <div className="lg:col-span-8 space-y-24">
                            <section>
                                <h2 className="text-3xl font-display font-medium mb-8 flex items-center gap-4">
                                    <Activity className="text-primary" />
                                    About the Phoenix
                                </h2>
                                <div className="prose prose-invert prose-lg max-w-none text-white/70 leading-relaxed">
                                    {festival.description.split('\n').map((para, i) => (
                                        <p key={i} className="mb-6">{para}</p>
                                    ))}
                                </div>
                            </section>

                            {/* Activities Grid */}
                            {festival.activities && festival.activities.length > 0 && (
                                <section>
                                    <h2 className="text-3xl font-display font-medium mb-12 flex items-center gap-4">
                                        <Star className="text-primary" />
                                        Core Experiences
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {festival.activities.map((activity, i) => (
                                            <div 
                                                key={i} 
                                                className="flex items-center gap-4 p-6 rounded-3xl bg-secondary/10 border border-border/5 hover:border-primary/20 transition-colors group"
                                            >
                                                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                    <CheckCircle2 size={20} className="text-primary" />
                                                </div>
                                                <span className="text-xl font-medium text-white/90">{activity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Gallery Section */}
                            {festival.gallery && festival.gallery.length > 0 && (
                                <section>
                                    <h2 className="text-3xl font-display font-medium mb-12 flex items-center gap-4">
                                        <ImageIcon className="text-primary" />
                                        The Visual Journey
                                    </h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        {festival.gallery.map((img, i) => (
                                            <motion.div 
                                                key={i}
                                                whileHover={{ scale: 1.02 }}
                                                className={`overflow-hidden rounded-3xl cursor-pointer ${i % 3 === 0 ? 'col-span-2 aspect-[21/9]' : 'aspect-square'}`}
                                            >
                                                <img 
                                                    src={img} 
                                                    alt={`Gallery ${i}`} 
                                                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                                                />
                                            </motion.div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Right Column: Sticky Sidebar Info */}
                        <div className="lg:col-span-4">
                            <div className="sticky top-32 space-y-8">
                                <div className="p-8 rounded-[40px] bg-card border border-border backdrop-blur-3xl overflow-hidden relative group">
                                    {/* Animated background accent */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:bg-primary/20 transition-colors" />
                                    
                                    <h3 className="text-2xl font-display font-medium mb-8 flex items-center gap-3">
                                        <Users className="text-primary" />
                                        Host
                                    </h3>
                                    
                                    <div className="flex items-center gap-5 mb-10 p-4 rounded-3xl bg-secondary/10 border border-border/5">
                                        <img 
                                            src={festival.author.avatar} 
                                            alt={festival.author.name} 
                                            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-primary/20"
                                        />
                                        <div>
                                            <span className="block text-sm text-muted-foreground mb-1 uppercase tracking-widest">Organized by</span>
                                            <h4 className="text-xl font-medium">{festival.author.name}</h4>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Button 
                                            asChild
                                            className="w-full h-16 rounded-2xl bg-primary text-black hover:bg-primary/90 text-lg font-semibold"
                                        >
                                            <a href="#" target="_blank" className="flex items-center justify-center gap-2">
                                                Buy Tickets
                                                <ExternalLink size={20} />
                                            </a>
                                        </Button>
                                        
                                        <div className="flex gap-4">
                                            <Button 
                                                variant="outline" 
                                                onClick={() => setLiked(!liked)}
                                                className={`flex-1 h-16 rounded-2xl border-border hover:bg-accent transition-all ${liked ? 'text-primary border-primary/30 bg-primary/5' : 'text-muted-foreground'}`}
                                            >
                                                <Heart className={liked ? 'fill-current' : ''} size={20} />
                                            </Button>
                                            <Button 
                                                variant="outline"
                                                className="flex-1 h-16 rounded-2xl border-border hover:bg-accent text-muted-foreground"
                                            >
                                                <Share2 size={20} />
                                            </Button>
                                        </div>
                                    </div>
                                    
                                    {festival.social_tags && festival.social_tags.length > 0 && (
                                        <div className="mt-10 flex flex-wrap gap-2">
                                            {festival.social_tags.map((tag, i) => (
                                                <span 
                                                    key={i} 
                                                    className="px-3 py-1 text-xs font-mono text-primary/60 border border-primary/20 rounded-lg hover:bg-primary/5 cursor-default transition-colors"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Map Section - Full Width & Modern Styling - Aligned with Theme */}
                <section className="py-24 border-t border-border/10">
                    <div className="max-w-7xl mx-auto px-6 mb-12">
                        <h2 className="text-4xl font-display font-medium mb-4">Location</h2>
                        <p className="text-muted-foreground text-lg mb-8">{festival.location?.address ?? 'Detailed coordinates encrypted'}</p>
                    </div>

                    <div className="h-[500px] w-full relative group bg-background">
                        {/* Overlay for depth effect */}
                        <div className="absolute inset-0 z-10 pointer-events-none border-y border-white/5 bg-gradient-to-b from-background via-transparent to-background" />
                        
                        <div className="h-full w-full">
                            <Map
                                center={center}
                                zoom={13}
                                className="h-full w-full"
                            >
                                <MapMarker 
                                    latitude={lat} 
                                    longitude={lng}
                                >
                                    <MarkerContent>
                                        <div className="relative group">
                                            <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/40 transition-all duration-500 animate-pulse" />
                                            <MapPin className="w-8 h-8 text-primary fill-primary/20 relative z-10" />
                                        </div>
                                    </MarkerContent>
                                    <MarkerPopup>
                                        <div className="p-2 min-w-[150px]">
                                            <p className="font-bold text-sm text-primary uppercase mb-1">{festival.title}</p>
                                            <p className="text-xs text-muted-foreground">{festival.location?.name || 'Festival Location'}</p>
                                        </div>
                                    </MarkerPopup>
                                </MapMarker>
                                <MapControls position="top-right" />
                            </Map>
                        </div>

                        {/* Map floating coordinates tag */}
                        <div className="absolute top-8 left-8 z-20 px-4 py-2 rounded-xl bg-background/80 backdrop-blur-xl border border-border/10 text-xs font-mono text-muted-foreground/60">
                            {lat.toFixed(4)}° N, {lng.toFixed(4)}° E
                        </div>
                    </div>
                </section>

                {/* Review Section */}
                <ReviewSection reviews={festival.reviews} festivalId={festival.id} />

                {/* Footer Link back home */}
                <div className="py-20 text-center border-t border-white/5">
                    <Link 
                        href="/"
                        className="inline-flex items-center gap-3 text-2xl font-display text-muted-foreground hover:text-white transition-colors group"
                    >
                        <ChevronLeft />
                        Back to the Realm
                        <div className="w-1 h-1 rounded-full bg-primary scale-0 group-hover:scale-100 transition-transform" />
                    </Link>
                </div>
            </div>
        </MainLayout>
    );
}
