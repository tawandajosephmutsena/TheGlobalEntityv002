import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star } from 'lucide-react';
import type { CommunityReviewBlock } from '@/types/page-blocks';

interface EditorProps {
    content: CommunityReviewBlock['content'];
    onUpdate: (updates: Partial<CommunityReviewBlock['content']>) => void;
}

const CommunityReviewEditor: React.FC<EditorProps> = ({ content, onUpdate }) => {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>Block Title</Label>
                <Input
                    value={content.title || ''}
                    onChange={(e) => onUpdate({ title: e.target.value })}
                    placeholder="Community Voices"
                />
            </div>

            <div className="space-y-2">
                <Label>Subtitle</Label>
                <Input
                    value={content.subtitle || ''}
                    onChange={(e) => onUpdate({ subtitle: e.target.value })}
                    placeholder="What fellow travelers are saying"
                />
            </div>

            <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                    value={content.description || ''}
                    onChange={(e) => onUpdate({ description: e.target.value })}
                    placeholder="Add a brief intro for the reviews section..."
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Layout</Label>
                    <Select
                        value={content.layout || 'grid'}
                        onValueChange={(val: string) => onUpdate({ layout: val as CommunityReviewBlock['content']['layout'] })}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="grid">Grid</SelectItem>
                            <SelectItem value="list">List</SelectItem>
                            <SelectItem value="carousel">Carousel</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Review Limit</Label>
                    <Input
                        type="number"
                        value={content.limit || 3}
                        onChange={(e) => onUpdate({ limit: parseInt(e.target.value) })}
                        min={1}
                        max={12}
                    />
                </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                <div className="space-y-0.5">
                    <Label className="text-base">Show Ratings</Label>
                    <p className="text-xs text-muted-foreground">
                        Display star ratings for Vibe and Safety
                    </p>
                </div>
                <Switch
                    checked={content.showRatings !== false}
                    onCheckedChange={(checked) => onUpdate({ showRatings: checked })}
                />
            </div>

            <div className="p-4 rounded-lg border border-primary/20 bg-primary/5 flex items-start gap-3">
                <Star className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                    <p className="text-sm font-semibold text-primary">Dynamic Source</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        This block automatically pulls approved reviews from the platform. 
                        In the editor, you see a preview with sample data.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CommunityReviewEditor;
