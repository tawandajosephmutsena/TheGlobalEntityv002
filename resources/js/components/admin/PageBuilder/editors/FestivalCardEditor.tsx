import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Ticket } from 'lucide-react';
import axios from 'axios';
import type { FestivalCardBlock } from '@/types/page-blocks';

interface EditorProps {
    content: FestivalCardBlock['content'];
    onUpdate: (updates: Partial<FestivalCardBlock['content']>) => void;
}

const FestivalCardEditor: React.FC<EditorProps> = ({ content, onUpdate }) => {
    const [availableFestivals, setAvailableFestivals] = useState<any[]>([]);
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

    const selectedFestival = availableFestivals.find(f => f.id === content.festivalId);

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>Linked Festival</Label>
                <div className="space-y-3">
                    <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer"
                        title="Select a festival"
                        value={content.festivalId || ''}
                        onChange={(e) => onUpdate({ festivalId: e.target.value ? parseInt(e.target.value) : undefined })}
                        disabled={loading}
                    >
                        <option value="">Select a festival...</option>
                        {availableFestivals.map((festival: any) => (
                            <option key={festival.id} value={festival.id}>
                                {festival.title}
                            </option>
                        ))}
                    </select>

                    {selectedFestival && (
                        <div className="p-3 bg-muted/50 rounded-lg border flex items-center gap-3">
                            <img 
                                src={selectedFestival.image} 
                                alt="" 
                                className="w-12 h-12 rounded object-cover border bg-background"
                            />
                            <div className="min-w-0">
                                <p className="text-sm font-semibold truncate">{selectedFestival.title}</p>
                                <p className="text-xs text-muted-foreground truncate">{selectedFestival.locationAddress}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label>Card Variant</Label>
                <Select
                    value={content.variant || 'dreamy'}
                    onValueChange={(val: string) => onUpdate({ variant: val as FestivalCardBlock['content']['variant'] })}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="dreamy">Dreamy Dark (Standard)</SelectItem>
                        <SelectItem value="elegant">Elegant Light</SelectItem>
                        <SelectItem value="compact">Compact List Item</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>CTA Button Text</Label>
                <Input
                    value={content.ctaText || ''}
                    onChange={(e) => onUpdate({ ctaText: e.target.value })}
                    placeholder="Join the Magic"
                />
            </div>

            <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label>Show Activities</Label>
                        <p className="text-xs text-muted-foreground">List festival highlights</p>
                    </div>
                    <Switch
                        checked={content.showActivities !== false}
                        onCheckedChange={(checked) => onUpdate({ showActivities: checked })}
                    />
                </div>

                <div className="flex items-center justify-between border-t pt-4">
                    <div className="space-y-0.5">
                        <Label>Show Visual Tags</Label>
                        <p className="text-xs text-muted-foreground">Sustainability & lifestyle badges</p>
                    </div>
                    <Switch
                        checked={content.showTags !== false}
                        onCheckedChange={(checked) => onUpdate({ showTags: checked })}
                    />
                </div>
            </div>

            <div className="p-4 rounded-lg border border-primary/20 bg-primary/5 flex items-start gap-3">
                <Ticket className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                    <p className="text-sm font-semibold text-primary">Content Linking</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        In production, this card will automatically fetch the latest info (dates, location, image) for the selected Festival ID.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FestivalCardEditor;
