import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import { motion } from 'framer-motion';
import { 
    Calendar, 
    MapPin, 
    ExternalLink, 
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
import { Badge } from '@/components/ui/badge';
import { ReviewSection } from '@/components/Sections/ReviewSection';
import { Carousel, Card } from '@/components/ui/apple-cards-carousel';

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
                                <span className="px-4 py-1.5 rounded-full bg-primary text-black text-sm font-semibold tracking-wide">
                                    {festival.category}
                                </span>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
                                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                    <span className="text-xs font-medium text-foreground/90">Featured Event</span>
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
                                <div className="prose prose-neutral dark:prose-invert prose-lg max-w-none text-muted-foreground leading-relaxed">
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
                                                <span className="text-xl font-medium text-foreground/90">{activity}</span>
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
                                    <div className="relative">
                                        <Carousel 
                                            items={festival.gallery.map((img, i) => (
                                                <Card 
                                                    key={i}
                                                    card={{
                                                        src: img,
                                                        title: `Moment ${i + 1}`,
                                                        category: "Festival Vibe",
                                                    }}
                                                    index={i}
                                                />
                                            ))} 
                                        />
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
                                            <span className="block text-sm text-muted-foreground mb-1 tracking-widest">Organized by</span>
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

                {/* Map Section - Boxed & Modern Styling - Aligned with Theme */}
                <section className="py-24 border-t border-border/10">
                    <div className="max-w-7xl mx-auto px-6 mb-12">
                        <h2 className="text-4xl font-display font-medium mb-4">Location</h2>
                        <p className="text-muted-foreground text-lg mb-8">{festival.location?.address ?? 'Detailed coordinates encrypted'}</p>
                    </div>

                    <div className="max-w-7xl mx-auto px-6">
                        <div className="h-[500px] w-full relative group bg-background rounded-3xl overflow-hidden shadow-2xl border border-white/5">
                            {/* Full visibility map container */}
                            
                            <div className="h-full w-full">
                                <Map
                                    center={center}
                                    zoom={13}
                                    className="h-full w-full"
                                    cooperativeGestures={true}
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
                                        <MarkerPopup className="p-3 w-[220px] rounded-3xl border border-white/10 shadow-2xl bg-background/50 backdrop-blur-2xl flex flex-col gap-3">
                                            {/* Top Text Section */}
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/20">
                                                    <MapPin size={14} className="text-primary" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-sm text-foreground leading-tight truncate">{festival.title}</h4>
                                                    <p className="text-[10px] text-foreground/70 truncate">{festival.location?.address.split(',')[0] || 'Location'}</p>
                                                </div>
                                            </div>

                                            {/* Middle Image Section */}
                                            {festival.image && (
                                                <div className="relative h-28 w-full rounded-2xl overflow-hidden shrink-0">
                                                    <img 
                                                        src={festival.image} 
                                                        alt={festival.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <Badge className="absolute top-2 right-2 bg-background/70 backdrop-blur-md text-foreground text-[8px] font-bold py-0.5 px-2 rounded-full border border-white/10">
                                                        {festival.category}
                                                    </Badge>
                                                </div>
                                            )}

                                            {/* Bottom Button Section */}
                                            <div className="flex justify-between items-center mt-0.5">
                                                <div className="flex-1"></div>
                                                <Button 
                                                    asChild 
                                                    variant="secondary" 
                                                    size="sm" 
                                                    className="h-8 px-4 text-[11px] font-semibold rounded-full bg-white/10 hover:bg-primary text-foreground hover:text-black border border-white/10 transition-colors"
                                                >
                                                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`} target="_blank" rel="noopener noreferrer">
                                                        Get Directions
                                                    </a>
                                                </Button>
                                            </div>
                                        </MarkerPopup>
                                    </MapMarker>
                                    <MapControls 
                                        position="top-right" 
                                        showLocate 
                                        showFullscreen 
                                        showCompass 
                                        showStyleSwitcher
                                    />
                                </Map>
                            </div>

                            {/* Map floating coordinates tag */}
                            <div className="absolute top-8 left-8 z-20 px-6 py-3 rounded-2xl bg-background/60 backdrop-blur-2xl border border-white/10 shadow-2xl group/coord">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] tracking-[0.2em] text-primary/60 font-semibold">Location Data</span>
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-mono text-foreground/80">{lat.toFixed(6)}° N</span>
                                            <span className="text-xs font-mono text-foreground/80">{lng.toFixed(6)}° E</span>
                                        </div>
                                        <div className="w-px h-8 bg-white/10" />
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-muted-foreground">Altitude</span>
                                            <span className="text-xs font-mono text-foreground/80">342m MSL</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Review Section */}
                <ReviewSection reviews={festival.reviews} festivalId={festival.id} />

            </div>
        </MainLayout>
    );
}
