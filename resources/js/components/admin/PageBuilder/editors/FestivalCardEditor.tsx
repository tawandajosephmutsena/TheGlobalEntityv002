import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Ticket } from 'lucide-react';
import type { FestivalCardBlock } from '@/types/page-blocks';

interface EditorProps {
    content: FestivalCardBlock['content'];
    onUpdate: (updates: Partial<FestivalCardBlock['content']>) => void;
}

const FestivalCardEditor: React.FC<EditorProps> = ({ content, onUpdate }) => {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>Festival ID</Label>
                <Input
                    type="number"
                    value={content.festivalId || ''}
                    onChange={(e) => onUpdate({ festivalId: e.target.value ? parseInt(e.target.value) : undefined })}
                    placeholder="Enter database ID..."
                />
                <p className="text-[10px] text-muted-foreground italic">Tip: Find the ID in the Festival Management section</p>
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
