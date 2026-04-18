import React, { useEffect, useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Image as ImageIcon, Zap, Search } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import type { FestivalBentoGridBlock } from '@/types/page-blocks';
import MediaLibrary from '@/components/admin/MediaLibrary';
import type { MediaAsset } from '@/types';
import axios from 'axios';

interface FestivalData {
    id: number;
    title: string;
    locationAddress: string;
    image: string;
    url: string;
    social_tags?: string[];
    rating?: string;
}

interface FestivalBentoGridEditorProps {
    content: FestivalBentoGridBlock['content'];
    onUpdate: (updates: Partial<FestivalBentoGridBlock['content']>) => void;
}

export default function FestivalBentoGridEditor({ content, onUpdate }: FestivalBentoGridEditorProps) {
    const [festivals, setFestivals] = useState<FestivalData[]>([]);
    const [loadingFestivals, setLoadingFestivals] = useState(false);

    useEffect(() => {
        const fetchFestivals = async () => {
            try {
                setLoadingFestivals(true);
                const response = await axios.get('/api/collections/festivals?limit=100');
                setFestivals(response.data.data || []);
            } catch (error) {
                console.error("Failed to fetch festivals for editor", error);
            } finally {
                setLoadingFestivals(false);
            }
        };
        fetchFestivals();
    }, []);

    const updateItem = (index: number, updates: Partial<FestivalBentoGridBlock['content']['items'][number]>) => {
        const newItems = [...(content.items || [])];
        newItems[index] = { ...newItems[index], ...updates } as FestivalBentoGridBlock['content']['items'][number]; 
        onUpdate({ items: newItems });
    };

    const handleFestivalSelect = (index: number, festivalId: string) => {
        const festival = festivals.find((f: FestivalData) => f.id.toString() === festivalId);
        if (festival) {
            updateItem(index, {
                festivalId: festival.id,
                title: festival.title.toUpperCase(),
                location: festival.locationAddress.toUpperCase(),
                image: festival.image,
                link: festival.url,
                rating: festival.rating || '4.5',
                tags: festival.social_tags?.slice(0, 2) || []
            });
        } else {
            updateItem(index, { festivalId: undefined });
        }
    };

    const addItem = () => {
        const newItem = {
            id: crypto.randomUUID(),
            type: 'festival' as const,
            title: 'NEW ITEM',
            subtitle: '',
            size: 'md' as const
        };
        onUpdate({ items: [...(content.items || []), newItem] });
    };

    const removeItem = (index: number) => {
        const newItems = [...(content.items || [])].filter((_, i) => i !== index);
        onUpdate({ items: newItems });
    };

    return (
        <div className="space-y-6 md:p-1">
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label>Title</Label>
                    <Input 
                        value={content.title || ''} 
                        onChange={(e) => onUpdate({ title: e.target.value })} 
                        placeholder="The Ethereal Collection"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Subtitle</Label>
                    <Input 
                        value={content.subtitle || ''} 
                        onChange={(e) => onUpdate({ subtitle: e.target.value })} 
                        placeholder="EXPLORE THE ARCHIVE"
                    />
                </div>
                <div className="space-y-2">
                    <Label>CTA Button Text</Label>
                    <Input 
                        value={content.ctaText || ''} 
                        onChange={(e) => onUpdate({ ctaText: e.target.value })} 
                        placeholder="View All Festivals"
                    />
                </div>
                <div className="space-y-2">
                    <Label>CTA Link</Label>
                    <Input 
                        value={content.ctaLink || ''} 
                        onChange={(e) => onUpdate({ ctaLink: e.target.value })} 
                        placeholder="/festivals"
                    />
                </div>
            </div>

            <div className="p-4 border rounded-xl bg-agency-accent/5 border-agency-accent/20 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label className="text-base flex items-center gap-2">
                            <Zap size={16} className="text-agency-accent" />
                            Dynamic Festivals
                        </Label>
                        <p className="text-sm text-muted-foreground">
                            Automatically pull festivals from the database.
                        </p>
                    </div>
                    <Switch 
                        checked={content.useDynamicFestivals || false}
                        onCheckedChange={(checked) => onUpdate({ useDynamicFestivals: checked })}
                    />
                </div>

                {content.useDynamicFestivals && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        <Label>Number of Festivals to Fetch</Label>
                        <Input 
                            type="number"
                            min={1}
                            max={10}
                            value={content.dynamicLimit || 3}
                            onChange={(e) => onUpdate({ dynamicLimit: parseInt(e.target.value) })}
                        />
                        <p className="text-[10px] text-muted-foreground italic">
                            These will replace the manual 'Festival Card' items below in order.
                        </p>
                    </div>
                )}
            </div>

            <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                    <Label className="text-lg font-bold">Bento Items</Label>
                    <Button variant="outline" size="sm" type="button" onClick={addItem}>
                        <Plus size={14} className="mr-2" /> Add Item
                    </Button>
                </div>
                
                <div className="space-y-6">
                    {(content.items || []).map((item, index) => (
                        <div key={item.id} className="p-4 border rounded-xl bg-muted/20 relative group">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                type="button"
                                className="absolute top-2 right-2 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeItem(index)}
                            >
                                <Trash2 size={14} />
                            </Button>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Type</Label>
                                    <select 
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                        value={item.type}
                                        onChange={(e) => updateItem(index, { type: e.target.value as FestivalBentoGridBlock['content']['items'][number]['type'] })}
                                        title="Item type"
                                    >
                                        <option value="festival">Festival Card</option>
                                        <option value="stat">Statistic</option>
                                        <option value="feature">Feature Info</option>
                                        <option value="signup">Newsletter Signup</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Grid Size</Label>
                                    <select 
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                        value={item.size}
                                        onChange={(e) => updateItem(index, { size: e.target.value as FestivalBentoGridBlock['content']['items'][number]['size'] })}
                                        title="Grid size"
                                    >
                                        <option value="sm">Small (1x1)</option>
                                        <option value="md">Medium (1x1 Responsive)</option>
                                        <option value="lg">Large (2x2)</option>
                                        <option value="wide">Wide (2x1)</option>
                                        <option value="tall">Tall (1x2)</option>
                                    </select>
                                </div>
                                <div className="space-y-2 sm:col-span-2">
                                    <Label>Main Title {content.useDynamicFestivals && item.type === 'festival' && <span className="text-[10px] text-agency-accent ml-2">(Overridden in Dynamic Mode)</span>}</Label>
                                    <Input 
                                        value={item.title} 
                                        onChange={(e) => updateItem(index, { title: e.target.value })} 
                                        disabled={content.useDynamicFestivals && item.type === 'festival'}
                                    />
                                </div>
                                
                                {item.type === 'festival' && (
                                    <>
                                        <div className="space-y-2 sm:col-span-2 p-3 bg-agency-accent/5 rounded-lg border border-agency-accent/10">
                                            <Label className="flex items-center gap-2">
                                                <Search size={14} className="text-agency-accent" />
                                                Link to System Festival
                                            </Label>
                                            <select 
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                                value={item.festivalId || ''}
                                                onChange={(e) => handleFestivalSelect(index, e.target.value)}
                                                title="Select a festival"
                                                disabled={loadingFestivals}
                                            >
                                                <option value="">-- No Festival Selected --</option>
                                                {festivals.map(f => (
                                                    <option key={f.id} value={f.id}>{f.title}</option>
                                                ))}
                                            </select>
                                            <p className="text-[10px] text-muted-foreground italic">
                                                Selecting a festival will automatically fill the fields below.
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Location</Label>
                                            <Input 
                                                value={item.location || ''} 
                                                onChange={(e) => updateItem(index, { location: e.target.value })} 
                                                placeholder="Location (Overwritten by selected festival)"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Rating</Label>
                                            <Input 
                                                value={item.rating || ''} 
                                                onChange={(e) => updateItem(index, { rating: e.target.value })} 
                                            />
                                        </div>
                                        <div className="space-y-2 sm:col-span-2">
                                            <Label>Image</Label>
                                            <div className="flex gap-2">
                                                <MediaLibrary 
                                                    onSelect={(asset: MediaAsset) => updateItem(index, { image: asset.relative_url })}
                                                    trigger={
                                                        <Button type="button" variant="outline" size="sm" className="h-10">
                                                            <ImageIcon className="h-4 w-4 mr-2" /> Select
                                                        </Button>
                                                    }
                                                />
                                                <Input 
                                                    className="flex-1" 
                                                    value={item.image || ''} 
                                                    onChange={(e) => updateItem(index, { image: e.target.value })} 
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {item.type !== 'festival' && (
                                    <div className="space-y-2 sm:col-span-2">
                                        <Label>Subtitle / Description</Label>
                                        <Textarea 
                                            value={item.subtitle || ''} 
                                            onChange={(e) => updateItem(index, { subtitle: e.target.value })} 
                                            rows={2}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
