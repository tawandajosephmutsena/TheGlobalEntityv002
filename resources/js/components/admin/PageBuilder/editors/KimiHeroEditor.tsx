import React from 'react';
import { Image as ImageIcon, Trash2, Plus, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import MediaLibrary from '@/components/admin/MediaLibrary';
import { MediaAsset } from '@/types';

interface KimiHeroEditorProps {
    block: any;
    onUpdate: (block: any) => void;
}

export default function KimiHeroEditor({ block, onUpdate }: KimiHeroEditorProps) {
    const updateContent = (updates: Record<string, any>) => {
        onUpdate({ 
            ...block, 
            content: { ...block.content, ...updates } 
        });
    };
    
    const content = block.content || {};
    const images = (content.images as string[]) || [];

    return (
        <div className="space-y-6">
            {/* Theme Info Banner */}
            <div className="flex items-start gap-2 p-3 rounded-lg border bg-accent/10 border-accent/30">
                <Info className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                    This section automatically adopts <strong>colors, fonts, and styling</strong> from your active theme preset.
                    Change your theme in <strong>Settings → Theme & Branding</strong>.
                </p>
            </div>

            {/* === TEXT CONTENT === */}
            <div className="space-y-4">
                <Label className="text-xs font-bold uppercase tracking-wider">Text Content</Label>
                <div className="space-y-1">
                    <Label htmlFor="kimi-title" className="text-[10px] text-muted-foreground">Headline (Italic Line)</Label>
                    <Input
                        id="kimi-title"
                        className="h-8 text-xs"
                        value={String(content.title || '')}
                        onChange={(e) => updateContent({ title: e.target.value })}
                        placeholder="Streamline Your Team,"
                    />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="kimi-subtitle" className="text-[10px] text-muted-foreground">Headline (Bold Line)</Label>
                    <Input
                        id="kimi-subtitle"
                        className="h-8 text-xs"
                        value={String(content.subtitle || '')}
                        onChange={(e) => updateContent({ subtitle: e.target.value })}
                        placeholder="Supercharge Your Workflow"
                    />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="kimi-description" className="text-[10px] text-muted-foreground">Description</Label>
                    <Textarea
                        id="kimi-description"
                        className="min-h-[60px] text-xs"
                        value={String(content.description || '')}
                        onChange={(e) => updateContent({ description: e.target.value })}
                        placeholder="All-in-one platform to plan, collaborate, and deliver..."
                    />
                </div>
            </div>

            {/* === CTA BUTTONS === */}
            <div className="space-y-3 pt-4 border-t">
                <Label className="text-xs font-bold uppercase tracking-wider">CTA Buttons</Label>
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <Label htmlFor="kimi-cta-text" className="text-[10px] text-muted-foreground">Primary Text</Label>
                        <Input
                            id="kimi-cta-text"
                            className="h-8 text-xs"
                            value={String(content.ctaText || '')}
                            onChange={(e) => updateContent({ ctaText: e.target.value })}
                            placeholder="Get started for Free"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="kimi-cta-link" className="text-[10px] text-muted-foreground">Primary Link</Label>
                        <Input
                            id="kimi-cta-link"
                            className="h-8 text-xs"
                            value={String(content.ctaLink || '')}
                            onChange={(e) => updateContent({ ctaLink: e.target.value })}
                            placeholder="/register"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="kimi-cta2-text" className="text-[10px] text-muted-foreground">Secondary Text</Label>
                        <Input
                            id="kimi-cta2-text"
                            className="h-8 text-xs"
                            value={String(content.ctaSecondaryText || '')}
                            onChange={(e) => updateContent({ ctaSecondaryText: e.target.value })}
                            placeholder="Optional"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="kimi-cta2-link" className="text-[10px] text-muted-foreground">Secondary Link</Label>
                        <Input
                            id="kimi-cta2-link"
                            className="h-8 text-xs"
                            value={String(content.ctaSecondaryLink || '')}
                            onChange={(e) => updateContent({ ctaSecondaryLink: e.target.value })}
                            placeholder="Optional"
                        />
                    </div>
                </div>
            </div>

            {/* === BACKGROUND OVERRIDE (optional) === */}
            <div className="space-y-3 pt-4 border-t">
                <Label className="text-xs font-bold uppercase tracking-wider">Background Override</Label>
                <p className="text-[10px] text-muted-foreground">
                    Leave empty to use your theme's background color. Set a custom color to override it for this section only.
                </p>
                <div className="flex gap-2 items-center">
                    <Input
                        type="color"
                        className="w-10 h-8 p-0.5 border-none bg-transparent cursor-pointer shrink-0"
                        aria-label="Background color picker"
                        title="Pick background color"
                        value={String(content.backgroundColor || '#ffffff')}
                        onChange={(e) => updateContent({ backgroundColor: e.target.value })}
                    />
                    <Input
                        className="h-8 text-xs flex-1 font-mono"
                        value={String(content.backgroundColor || '')}
                        onChange={(e) => updateContent({ backgroundColor: e.target.value })}
                        placeholder="Leave empty for theme default"
                        aria-label="Background color value"
                        title="Background color hex value"
                    />
                    {content.backgroundColor && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0"
                            onClick={() => updateContent({ backgroundColor: '' })}
                            title="Reset to theme default"
                        >
                            <Trash2 className="w-3 h-3" />
                        </Button>
                    )}
                </div>
            </div>

            {/* === CAROUSEL SPEED === */}
            <div className="space-y-2 pt-4 border-t">
                <Label htmlFor="kimi-speed" className="text-xs font-bold uppercase tracking-wider">Scroll Speed</Label>
                <p className="text-[10px] text-muted-foreground">
                    Lower = faster. Higher = slower. Default is 30 seconds per full cycle.
                </p>
                <Input
                    id="kimi-speed"
                    type="number"
                    className="h-8 text-xs w-32"
                    value={Number(content.scrollSpeed || 30)}
                    onChange={(e) => updateContent({ scrollSpeed: Number(e.target.value) })}
                    min={5}
                    max={120}
                />
            </div>

            {/* === CAROUSEL IMAGES === */}
            <div className="space-y-4 pt-4 border-t">
                <Label className="text-xs font-bold uppercase tracking-wider">Carousel Images</Label>

                {/* Recommended Size Note */}
                <div className="flex items-start gap-2 p-3 rounded-lg border border-yellow-500/30 bg-yellow-50 dark:bg-yellow-900/10">
                    <Info className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0" />
                    <div className="text-[10px] text-yellow-800 dark:text-yellow-300 leading-relaxed">
                        <strong>Recommended:</strong> 640 × 896px (portrait, 5:7 ratio). Use at least <strong>8 images</strong> for best results. Leave empty to use default placeholder images.
                    </div>
                </div>

                {/* Image Grid */}
                <div className="space-y-3">
                    {images.map((img: string, idx: number) => (
                        <div key={idx} className="p-3 border rounded-lg bg-muted/10 space-y-2">
                            <Label className="text-[10px] text-muted-foreground">Image {idx + 1}</Label>
                            {img && (
                                <img
                                    src={img}
                                    className="w-full h-24 object-cover rounded-md"
                                    alt={`Carousel ${idx + 1}`}
                                />
                            )}
                            <div className="flex gap-2">
                                <MediaLibrary
                                    onSelect={(asset: MediaAsset) => {
                                        const updated = [...images];
                                        updated[idx] = asset.url;
                                        updateContent({ images: updated });
                                    }}
                                    trigger={
                                        <Button type="button" variant="outline" size="sm" className="h-8 text-xs">
                                            <ImageIcon className="h-3 w-3 mr-1" />
                                            {img ? 'Change' : 'Upload'}
                                        </Button>
                                    }
                                />
                                <Input
                                    className="h-8 text-xs flex-1"
                                    value={img}
                                    onChange={(e) => {
                                        const updated = [...images];
                                        updated[idx] = e.target.value;
                                        updateContent({ images: updated });
                                    }}
                                    placeholder="Or paste image URL..."
                                    aria-label={`Image ${idx + 1} URL`}
                                    title={`URL for carousel image ${idx + 1}`}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 shrink-0 text-destructive hover:text-destructive"
                                    onClick={() => {
                                        const updated = images.filter((_: string, i: number) => i !== idx);
                                        updateContent({ images: updated });
                                    }}
                                    title={`Remove image ${idx + 1}`}
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => updateContent({ images: [...images, ''] })}
                >
                    <Plus className="h-3.5 w-3.5 mr-2" />
                    Add Image
                </Button>
            </div>
        </div>
    );
}
