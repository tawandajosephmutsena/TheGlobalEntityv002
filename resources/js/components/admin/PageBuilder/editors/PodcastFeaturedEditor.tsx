import React from 'react';
import { PodcastFeaturedBlock } from '@/types/page-blocks';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface PodcastFeaturedEditorProps {
    content: PodcastFeaturedBlock['content'];
    onUpdate: (updates: Partial<PodcastFeaturedBlock['content']>) => void;
}

export default function PodcastFeaturedEditor({ content, onUpdate }: PodcastFeaturedEditorProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="pfeat-title">Title</Label>
                <Input
                    id="pfeat-title"
                    value={content.title || ''}
                    onChange={(e) => onUpdate({ title: e.target.value })}
                    placeholder="Featured Episodes"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="pfeat-subtitle">Subtitle</Label>
                <Input
                    id="pfeat-subtitle"
                    value={content.subtitle || ''}
                    onChange={(e) => onUpdate({ subtitle: e.target.value })}
                    placeholder="Don't miss these"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="pfeat-description">Description</Label>
                <Textarea
                    id="pfeat-description"
                    value={content.description || ''}
                    onChange={(e) => onUpdate({ description: e.target.value })}
                    placeholder="Explore our hand-picked episodes..."
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="pfeat-layout">Layout Style</Label>
                    <select
                        id="pfeat-layout"
                        title="Layout style"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={content.layout || 'hero'}
                        onChange={(e) => onUpdate({ layout: e.target.value as 'hero' | 'cards' | 'list' | 'bento' })}
                    >
                        <option value="hero">Hero Spotlight</option>
                        <option value="bento">Bento Grid (Premium)</option>
                        <option value="cards">Card Grid</option>
                        <option value="list">List View</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="pfeat-limit">Max Episodes</Label>
                    <Input
                        id="pfeat-limit"
                        type="number"
                        min={1}
                        max={6}
                        value={content.limit || 3}
                        onChange={(e) => onUpdate({ limit: Number(e.target.value) })}
                    />
                </div>
            </div>

            <div className="flex items-center justify-between">
                <Label htmlFor="pfeat-play-btn">Show Play Button Overlay</Label>
                <Switch
                    id="pfeat-play-btn"
                    checked={content.showPlayButton !== false}
                    onCheckedChange={(checked) => onUpdate({ showPlayButton: checked })}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="pfeat-cta-text">CTA Button Text</Label>
                    <Input
                        id="pfeat-cta-text"
                        value={content.ctaText || ''}
                        onChange={(e) => onUpdate({ ctaText: e.target.value })}
                        placeholder="Browse All"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="pfeat-cta-href">CTA Button Link</Label>
                    <Input
                        id="pfeat-cta-href"
                        value={content.ctaHref || ''}
                        onChange={(e) => onUpdate({ ctaHref: e.target.value })}
                        placeholder="/podcasts"
                    />
                </div>
            </div>
        </div>
    );
}
