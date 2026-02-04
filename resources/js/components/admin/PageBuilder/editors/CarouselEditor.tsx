import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, ImagePlus, Database, Layers } from 'lucide-react';
import MediaLibrary from '@/components/admin/MediaLibrary';
import { MediaAsset } from '@/types';

interface Slide {
    title: string;
    button: string;
    src: string;
    link?: string;
}

interface CarouselEditorProps {
    content: {
        feedSource?: 'manual' | 'services' | 'portfolio' | 'insights';
        maxItems?: number;
        slides: Slide[];
    };
    onUpdate: (content: any) => void;
}

export default function CarouselEditor({ content, onUpdate }: CarouselEditorProps) {
    const slides = content.slides || [];
    const feedSource = content.feedSource || 'manual';
    const maxItems = content.maxItems || 6;

    const addSlide = () => {
        onUpdate({
            ...content,
            slides: [
                ...slides,
                {
                    title: "New Slide",
                    button: "Learn More",
                    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=3506&auto=format&fit=crop",
                    link: "#"
                }
            ]
        });
    };

    const updateSlide = (index: number, data: Partial<Slide>) => {
        const newSlides = [...slides];
        newSlides[index] = { ...newSlides[index], ...data };
        onUpdate({ ...content, slides: newSlides });
    };

    const removeSlide = (index: number) => {
        onUpdate({ ...content, slides: slides.filter((_, i) => i !== index) });
    };

    return (
        <div className="space-y-8">
            {/* Feed Source Selection */}
            <div className="grid grid-cols-2 gap-6 p-6 bg-muted/30 rounded-2xl border">
                <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        <Database className="h-3 w-3" /> Content Source
                    </Label>
                    <Select 
                        value={feedSource} 
                        onValueChange={(val: 'manual' | 'services' | 'portfolio' | 'insights') => onUpdate({ ...content, feedSource: val })}
                    >
                        <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="manual">Manual Entry</SelectItem>
                            <SelectItem value="portfolio">Portfolio Items</SelectItem>
                            <SelectItem value="insights">Blog Insights</SelectItem>
                            <SelectItem value="services">Our Services</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {feedSource !== 'manual' && (
                    <div className="space-y-3">
                        <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            <Layers className="h-3 w-3" /> Item Count
                        </Label>
                        <Input 
                            type="number" 
                            min={1} 
                            max={20}
                            value={maxItems}
                            onChange={(e) => onUpdate({ ...content, maxItems: parseInt(e.target.value) })}
                            className="bg-background"
                        />
                    </div>
                )}
            </div>

            {feedSource === 'manual' ? (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm font-bold uppercase tracking-wider">Manual Slides</Label>
                        <Button variant="outline" size="sm" onClick={addSlide} className="rounded-full">
                            <Plus className="h-3 w-3 mr-2" /> Add Slide
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {slides.map((slide, index) => (
                            <Card key={index} className="relative overflow-hidden group">
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                    onClick={() => removeSlide(index)}
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                                <CardContent className="p-5 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold uppercase text-muted-foreground">Slide Title</Label>
                                            <Input
                                                value={slide.title}
                                                onChange={(e) => updateSlide(index, { title: e.target.value })}
                                                placeholder="Enter title..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold uppercase text-muted-foreground">Button Text</Label>
                                            <Input
                                                value={slide.button}
                                                onChange={(e) => updateSlide(index, { button: e.target.value })}
                                                placeholder="Action text..."
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold uppercase text-muted-foreground">Link URL</Label>
                                            <Input
                                                value={slide.link || ''}
                                                onChange={(e) => updateSlide(index, { link: e.target.value })}
                                                placeholder="/portfolio/item"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold uppercase text-muted-foreground">Slide Image</Label>
                                            <div className="flex gap-2">
                                                <MediaLibrary
                                                    type="image"
                                                    onSelect={(asset: MediaAsset) => updateSlide(index, { src: asset.url })}
                                                    trigger={
                                                        <Button variant="outline" size="icon" className="shrink-0 h-9 w-9">
                                                            <ImagePlus className="h-4 w-4" />
                                                        </Button>
                                                    }
                                                />
                                                <Input
                                                    value={slide.src}
                                                    onChange={(e) => updateSlide(index, { src: e.target.value })}
                                                    placeholder="https://..."
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="aspect-[21/9] relative rounded-lg overflow-hidden border bg-muted/50">
                                        <img src={slide.src} alt="" className="w-full h-full object-cover" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {slides.length === 0 && (
                        <div className="p-12 border-2 border-dashed rounded-2xl text-center bg-muted/10">
                            <Plus className="h-8 w-8 mx-auto mb-3 text-muted-foreground/30" />
                            <p className="text-sm text-muted-foreground">Ready to add your first manual slide?</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="p-12 border-2 border-dashed rounded-2xl text-center bg-agency-accent/5 overflow-hidden relative">
                    <Database className="h-12 w-12 mx-auto mb-4 text-agency-accent animate-pulse" />
                    <h4 className="text-lg font-bold mb-2">Dynamic Mode Activated</h4>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                        We'll automatically pull the latest <strong>{maxItems} {feedSource}</strong> and display them in the carousel. 
                        No manual updating required!
                    </p>
                    {/* Decorative Background Icon */}
                    <Database className="absolute -bottom-10 -right-10 h-40 w-40 text-agency-accent/5 rotate-12" />
                </div>
            )}
        </div>
    );
}
