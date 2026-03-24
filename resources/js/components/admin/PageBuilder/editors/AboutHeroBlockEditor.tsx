import React from 'react';
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/Components/ui/button";
import { Image as ImageIcon } from 'lucide-react';
import type { AboutHeroBlock } from '@/types/page-blocks';
import MediaLibrary from '@/Components/admin/MediaLibrary';
import type { MediaAsset } from '@/types';

interface AboutHeroBlockEditorProps {
    content: AboutHeroBlock['content'];
    onUpdate: (updates: Partial<AboutHeroBlock['content']>) => void;
}

export default function AboutHeroBlockEditor({ content, onUpdate }: AboutHeroBlockEditorProps) {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label>Subtitle (Identity & Soul)</Label>
                    <Input 
                        value={content.subtitle || ''} 
                        onChange={(e) => onUpdate({ subtitle: e.target.value })} 
                        placeholder="e.g. Identity & Soul"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Title</Label>
                    <Input 
                        value={content.title || ''} 
                        onChange={(e) => onUpdate({ title: e.target.value })} 
                        placeholder="e.g. The Global… What?"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                    value={content.description || ''} 
                    onChange={(e) => onUpdate({ description: e.target.value })} 
                    placeholder="Describe the hero section..."
                    rows={4}
                />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label>CTA Text</Label>
                    <Input 
                        value={content.ctaText || ''} 
                        onChange={(e) => onUpdate({ ctaText: e.target.value })} 
                        placeholder="e.g. Join Journey"
                    />
                </div>
                <div className="space-y-2">
                    <Label>CTA Link</Label>
                    <Input 
                        value={content.ctaLink || ''} 
                        onChange={(e) => onUpdate({ ctaLink: e.target.value })} 
                        placeholder="e.g. #"
                    />
                </div>
            </div>

            <div className="space-y-2 pt-4 border-t">
                <Label>Hero Image (Small Circle)</Label>
                <div className="flex gap-2">
                    <MediaLibrary 
                        onSelect={(asset: MediaAsset) => onUpdate({ backgroundImage: asset.url })}
                        trigger={
                            <Button type="button" variant="outline" size="sm" className="h-10">
                                <ImageIcon className="h-4 w-4 mr-2" /> 
                                {content.backgroundImage ? 'Change' : 'Upload'}
                            </Button>
                        }
                    />
                    <Input 
                        className="flex-1" 
                        value={content.backgroundImage || ''} 
                        onChange={(e) => onUpdate({ backgroundImage: e.target.value })} 
                        placeholder="Image URL..." 
                    />
                </div>
            </div>
        </div>
    );
}
