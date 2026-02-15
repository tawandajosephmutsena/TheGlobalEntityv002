import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ImagePlus, Type } from 'lucide-react';
import MediaLibrary from '@/components/admin/MediaLibrary';
import { MediaAsset } from '@/types';

interface ScrollAnimationEditorProps {
    block: any;
    onUpdate: (block: any) => void;
}

export default function ScrollAnimationEditor({ block, onUpdate }: ScrollAnimationEditorProps) {
    const updateContent = (updates: Record<string, any>) => {
        onUpdate({ 
            ...block, 
            content: { ...block.content, ...updates } 
        });
    };

    const content = block.content || {};

    return (
        <div className="space-y-6">
            <div className="grid gap-4">
                <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                        <Type className="h-4 w-4" />
                        Main Title
                    </Label>
                    <Input
                        value={String(content.title || '')}
                        onChange={(e) => updateContent({ title: e.target.value })}
                        placeholder="e.g. Unleash the power of"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                        <Type className="h-4 w-4" />
                        Highlight Title (Large)
                    </Label>
                    <Input
                        value={String(content.highlightTitle || '')}
                        onChange={(e) => updateContent({ highlightTitle: e.target.value })}
                        placeholder="e.g. Scroll Animations"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                        <Type className="h-4 w-4" />
                        Highlight Color
                    </Label>
                    <div className="flex items-center gap-2">
                        <Input 
                            type="color"
                            className="w-10 p-1 shrink-0"
                            value={String(content.highlightColor || '#000000')}
                            onChange={(e) => updateContent({ highlightColor: e.target.value })}
                            title="Highlight Color"
                        />
                        <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 px-2 text-xs"
                            onClick={() => updateContent({ highlightColor: undefined })}
                            disabled={!content.highlightColor}
                        >
                            Reset to Theme
                        </Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                        <ImagePlus className="h-4 w-4" />
                        Main Image
                    </Label>
                    <div className="flex gap-2">
                        <MediaLibrary
                            type="image"
                            onSelect={(asset: MediaAsset) => updateContent({ image: asset.url })}
                            trigger={
                                <Button variant="outline" size="icon" className="shrink-0">
                                    <ImagePlus className="h-4 w-4" />
                                </Button>
                            }
                        />
                        <Input
                            value={String(content.image || '')}
                            onChange={(e) => updateContent({ image: e.target.value })}
                            placeholder="Image URL..."
                        />
                    </div>
                    {content.image && (
                        <div className="mt-2 aspect-video rounded-lg overflow-hidden border bg-muted">
                            <img src={String(content.image)} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
