import React from 'react';
import { PodcastGridBlock } from '@/types/page-blocks';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

interface PodcastGridEditorProps {
    content: PodcastGridBlock['content'];
    onUpdate: (updates: Partial<PodcastGridBlock['content']>) => void;
}

export default function PodcastGridEditor({ content, onUpdate }: PodcastGridEditorProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="pgrid-title">Title</Label>
                <Input
                    id="pgrid-title"
                    value={content.title || ''}
                    onChange={(e) => onUpdate({ title: e.target.value })}
                    placeholder="Our Podcasts"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="pgrid-subtitle">Subtitle</Label>
                <Input
                    id="pgrid-subtitle"
                    value={content.subtitle || ''}
                    onChange={(e) => onUpdate({ subtitle: e.target.value })}
                    placeholder="Listen to our latest episodes"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="pgrid-limit">Max Episodes</Label>
                    <Input
                        id="pgrid-limit"
                        type="number"
                        min={1}
                        max={12}
                        value={content.limit || 6}
                        onChange={(e) => onUpdate({ limit: Number(e.target.value) })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="pgrid-columns">Columns</Label>
                    <select
                        id="pgrid-columns"
                        title="Grid columns"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={content.columns || 3}
                        onChange={(e) => onUpdate({ columns: Number(e.target.value) as 2 | 3 | 4 })}
                    >
                        <option value={2}>2 Columns</option>
                        <option value={3}>3 Columns</option>
                        <option value={4}>4 Columns</option>
                    </select>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label htmlFor="pgrid-search">Show Search Bar</Label>
                    <Switch
                        id="pgrid-search"
                        checked={content.showSearch !== false}
                        onCheckedChange={(checked) => onUpdate({ showSearch: checked })}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="pgrid-categories">Show Category Filters</Label>
                    <Switch
                        id="pgrid-categories"
                        checked={content.showCategories !== false}
                        onCheckedChange={(checked) => onUpdate({ showCategories: checked })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="pgrid-cta-text">CTA Button Text</Label>
                    <Input
                        id="pgrid-cta-text"
                        value={content.ctaText || ''}
                        onChange={(e) => onUpdate({ ctaText: e.target.value })}
                        placeholder="View All Podcasts"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="pgrid-cta-href">CTA Button Link</Label>
                    <Input
                        id="pgrid-cta-href"
                        value={content.ctaHref || ''}
                        onChange={(e) => onUpdate({ ctaHref: e.target.value })}
                        placeholder="/podcasts"
                    />
                </div>
            </div>
        </div>
    );
}
