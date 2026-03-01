import React from 'react';
import { PodcastPlayerBlock } from '@/types/page-blocks';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface PodcastPlayerEditorProps {
    content: PodcastPlayerBlock['content'];
    onUpdate: (updates: Partial<PodcastPlayerBlock['content']>) => void;
}

export default function PodcastPlayerEditor({ content, onUpdate }: PodcastPlayerEditorProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="pplayer-slug">Podcast Slug</Label>
                <Input
                    id="pplayer-slug"
                    value={content.podcastSlug || ''}
                    onChange={(e) => onUpdate({ podcastSlug: e.target.value })}
                    placeholder="my-podcast-episode-title"
                />
                <p className="text-xs text-muted-foreground">
                    Enter the slug of the podcast episode to embed. Find this in Admin → Podcasts.
                </p>
            </div>

            <div className="space-y-2">
                <Label>Layout Variant</Label>
                <Select
                    value={content.variant || 'expanded'}
                    onValueChange={(val: 'compact' | 'basic' | 'expanded') => onUpdate({ variant: val })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select a layout" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="compact">Compact (Player Only)</SelectItem>
                        <SelectItem value="basic">Basic (Player + Title)</SelectItem>
                        <SelectItem value="expanded">Expanded (Player + Title + Info)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="pplayer-title">Custom Title (Optional)</Label>
                <Input
                    id="pplayer-title"
                    value={content.title || ''}
                    onChange={(e) => onUpdate({ title: e.target.value })}
                    placeholder="Leave blank to use podcast title"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="pplayer-desc">Custom Description (Optional)</Label>
                <Textarea
                    id="pplayer-desc"
                    value={content.description || ''}
                    onChange={(e) => onUpdate({ description: e.target.value })}
                    placeholder="Leave blank to use podcast description"
                />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label htmlFor="pplayer-related">Show Related Episodes</Label>
                    <Switch
                        id="pplayer-related"
                        checked={content.showRelated !== false}
                        onCheckedChange={(checked) => onUpdate({ showRelated: checked })}
                    />
                </div>

                {content.showRelated !== false && (
                    <div className="space-y-2">
                        <Label htmlFor="pplayer-related-limit">Related Episodes Count</Label>
                        <Input
                            id="pplayer-related-limit"
                            type="number"
                            min={1}
                            max={6}
                            value={content.relatedLimit || 3}
                            onChange={(e) => onUpdate({ relatedLimit: Number(e.target.value) })}
                        />
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <Label htmlFor="pplayer-autoplay">Autoplay</Label>
                    <Switch
                        id="pplayer-autoplay"
                        checked={content.autoplay === true}
                        onCheckedChange={(checked) => onUpdate({ autoplay: checked })}
                    />
                </div>
            </div>
        </div>
    );
}
