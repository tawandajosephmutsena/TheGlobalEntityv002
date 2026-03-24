import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Sparkles, X } from 'lucide-react';
import axios from 'axios';
import type { FeaturedFestivalsBlock } from '@/types/page-blocks';

interface Festival {
    id: number;
    title: string;
    image?: string;
    [key: string]: unknown;
}

interface EditorProps {
    content: FeaturedFestivalsBlock['content'];
    onUpdate: (updates: Partial<FeaturedFestivalsBlock['content']>) => void;
}

const FeaturedFestivalsEditor: React.FC<EditorProps> = ({ content, onUpdate }) => {
    const [availableFestivals, setAvailableFestivals] = useState<Festival[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchFestivals = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/collections/festivals');
                setAvailableFestivals(response.data.data || []);
            } catch (error) {
                console.error("Failed to fetch festivals for editor", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFestivals();
    }, []);

    const selectedFestivalIds = content.selectedFestivalIds || [];
    const selectedFestivals = selectedFestivalIds.map(id => 
        availableFestivals.find(f => f.id === id)
    ).filter((f): f is Festival => !!f);

    const toggleFestival = (id: number) => {
        const newIds = selectedFestivalIds.includes(id)
            ? selectedFestivalIds.filter(fid => fid !== id)
            : [...selectedFestivalIds, id];
        onUpdate({ selectedFestivalIds: newIds });
    };

    const removeFestival = (id: number) => {
        onUpdate({ selectedFestivalIds: selectedFestivalIds.filter(fid => fid !== id) });
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>Section Title</Label>
                <Input
                    value={content.title || ''}
                    onChange={(e) => onUpdate({ title: e.target.value })}
                    placeholder="Featured Festivals"
                />
            </div>

            <div className="space-y-2">
                <Label>Section Subtitle</Label>
                <Input
                    value={content.subtitle || ''}
                    onChange={(e) => onUpdate({ subtitle: e.target.value })}
                    placeholder="Magical gatherings..."
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Max Items</Label>
                    <Input
                        type="number"
                        value={content.limit || 6}
                        onChange={(e) => onUpdate({ limit: parseInt(e.target.value) })}
                    />
                </div>
                <div className="space-y-2">
                    <Label>CTA Text</Label>
                    <Input
                        value={content.ctaText || 'Join the Magic'}
                        onChange={(e) => onUpdate({ ctaText: e.target.value })}
                    />
                </div>
            </div>

            <div className="flex items-center justify-between border-t border-b py-4">
                <div className="space-y-0.5">
                    <Label>Show "View All" Button</Label>
                    <p className="text-xs text-muted-foreground">Link to the main festivals page</p>
                </div>
                <Switch
                    checked={content.showViewAll !== false}
                    onCheckedChange={(checked) => onUpdate({ showViewAll: checked })}
                />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Curation</Label>
                    <div className="text-xs text-muted-foreground">
                        {selectedFestivals.length} selected
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 min-h-[40px] p-2 rounded-md border border-dashed border-input bg-muted/30">
                    {selectedFestivals.length === 0 ? (
                        <span className="text-xs text-muted-foreground italic p-1">No festivals selected. Falling back to dynamic fetching...</span>
                    ) : (
                        selectedFestivals.map((festival: Festival) => (
                            <div 
                                key={festival.id} 
                                className="flex items-center gap-1.5 px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium border border-primary/20 group"
                            >
                                <span className="max-w-[120px] truncate">{festival.title}</span>
                                <button 
                                    type="button"
                                    onClick={() => removeFestival(festival.id)}
                                    className="p-0.5 hover:bg-primary/20 rounded-full transition-colors"
                                    title="Remove festival"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="space-y-2">
                    <Label className="text-xs font-medium">Add Festival</Label>
                    <div className="flex gap-2">
                        <select 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                            title="Select a festival to add"
                            onChange={(e) => {
                                if (e.target.value) {
                                    toggleFestival(parseInt(e.target.value));
                                    e.target.value = '';
                                }
                            }}
                            disabled={loading}
                        >
                            <option value="">Choose a festival...</option>
                            {availableFestivals
                                .filter(f => !selectedFestivalIds.includes(f.id))
                                .map((festival: Festival) => (
                                    <option key={festival.id} value={festival.id}>
                                        {festival.title}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                </div>
            </div>

            <div className="p-4 rounded-lg border border-primary/20 bg-primary/5 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                    <p className="text-sm font-semibold text-primary">Hybrid Logic</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Manually selected festivals will appear in your chosen order. 
                        If curation is empty, the block will automatically show festivals marked as "Featured".
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FeaturedFestivalsEditor;
