import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Sparkles } from 'lucide-react';
import axios from 'axios';
import type { StitchFeaturedFestivalsBlock } from '@/types/page-blocks';

interface FestivalData {
    id: number;
    title: string;
    locationAddress: string;
}

interface StitchFeaturedFestivalsEditorProps {
    block: StitchFeaturedFestivalsBlock;
    onUpdate: (updates: Partial<StitchFeaturedFestivalsBlock['content']>) => void;
}

export default function StitchFeaturedFestivalsEditor({ block, onUpdate }: StitchFeaturedFestivalsEditorProps) {
    const [festivals, setFestivals] = useState<FestivalData[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchFestivals = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/collections/festivals?limit=100');
                setFestivals(response.data.data || []);
            } catch (error) {
                console.error("Failed to fetch festivals for editor", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFestivals();
    }, []);

    const handleUpdate = (field: string, value: string | number | boolean | number[]) => {
        onUpdate({
            ...block.content,
            [field]: value
        });
    };

    const addFestival = (festivalId: number) => {
        const currentIds = block.content.selectedFestivalIds || [];
        if (!currentIds.includes(festivalId)) {
            handleUpdate('selectedFestivalIds', [...currentIds, festivalId]);
        }
    };

    const removeFestival = (festivalId: number) => {
        const currentIds = block.content.selectedFestivalIds || [];
        handleUpdate('selectedFestivalIds', currentIds.filter(id => id !== festivalId));
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="title">Block Title</Label>
                    <Input
                        id="title"
                        value={block.content.title || ''}
                        onChange={(e) => handleUpdate('title', e.target.value)}
                        placeholder="e.g. Global Spectacles"
                    />
                </div>
                
                <div className="grid gap-2">
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Textarea
                        id="subtitle"
                        value={block.content.subtitle || ''}
                        onChange={(e) => handleUpdate('subtitle', e.target.value)}
                        placeholder="e.g. Curated gatherings where culture, art, and geography collide."
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="limit">Display Limit (0 for all selected)</Label>
                    <Input
                        id="limit"
                        type="number"
                        min="0"
                        max="12"
                        value={block.content.limit ?? 6}
                        onChange={(e) => handleUpdate('limit', parseInt(e.target.value))}
                    />
                </div>

                <div className="pt-4 border-t border-border">
                    <Label className="mb-4 block font-bold text-agency-accent flex items-center gap-2">
                        <Sparkles size={16} />
                        Curated Festival Selection
                    </Label>
                    
                    <div className="space-y-3 mb-6">
                        <Label className="text-xs text-muted-foreground uppercase tracking-widest">Selected Festivals</Label>
                        <div className="flex flex-wrap gap-2">
                            {(block.content.selectedFestivalIds || []).map(id => {
                                const festival = festivals.find(f => f.id === id);
                                return (
                                    <div key={id} className="flex items-center gap-2 bg-agency-accent/10 border border-agency-accent/20 px-3 py-1.5 rounded-full text-sm">
                                        <span>{festival?.title || `ID: ${id}`}</span>
                                        <button 
                                            onClick={() => removeFestival(id)}
                                            className="text-muted-foreground hover:text-red-500 transition-colors"
                                            title="Remove"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                );
                            })}
                            {(block.content.selectedFestivalIds || []).length === 0 && (
                                <p className="text-sm text-muted-foreground italic">No specific festivals selected. Content will be dynamic.</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground uppercase tracking-widest">Add Festival</Label>
                        <div className="flex gap-2">
                            <select 
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                title="Select a festival"
                                onChange={(e) => {
                                    if (e.target.value) {
                                        addFestival(parseInt(e.target.value));
                                        e.target.value = '';
                                    }
                                }}
                                disabled={loading}
                            >
                                <option value="">-- Choose a festival from library --</option>
                                {festivals
                                    .filter(f => !(block.content.selectedFestivalIds || []).includes(f.id))
                                    .map(f => (
                                        <option key={f.id} value={f.id}>{f.title}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground border border-border/50">
                <p className="font-medium text-foreground mb-1">💡 Pro Tip:</p>
                <p>If you select specific festivals, they will be shown in order. If none are selected, the grid will automatically fetch featured festivals from the system.</p>
            </div>
        </div>
    );
}

