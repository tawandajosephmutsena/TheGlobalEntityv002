import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Sparkles } from 'lucide-react';
import type { FeaturedFestivalsBlock } from '@/types/page-blocks';

interface EditorProps {
    content: FeaturedFestivalsBlock['content'];
    onUpdate: (updates: Partial<FeaturedFestivalsBlock['content']>) => void;
}

const FeaturedFestivalsEditor: React.FC<EditorProps> = ({ content, onUpdate }) => {
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

            <div className="flex items-center justify-between border-t pt-4">
                <div className="space-y-0.5">
                    <Label>Show "View All" Button</Label>
                    <p className="text-xs text-muted-foreground">Link to the main festivals page</p>
                </div>
                <Switch
                    checked={content.showViewAll !== false}
                    onCheckedChange={(checked) => onUpdate({ showViewAll: checked })}
                />
            </div>

            <div className="p-4 rounded-lg border border-primary/20 bg-primary/5 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                    <p className="text-sm font-semibold text-primary">Slider Logic</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        This block automatically fetches festivals marked as "Featured" and "Published" in the database.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FeaturedFestivalsEditor;
