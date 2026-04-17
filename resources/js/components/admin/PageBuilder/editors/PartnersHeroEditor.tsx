import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon } from 'lucide-react';
import type { PartnersHeroBlock } from '@/types/page-blocks';
import MediaLibrary from '@/components/admin/MediaLibrary';
import type { MediaAsset } from '@/types';

interface PartnersHeroEditorProps {
    content: PartnersHeroBlock['content'];
    onUpdate: (updates: Partial<PartnersHeroBlock['content']>) => void;
}

export default function PartnersHeroEditor({ content, onUpdate }: PartnersHeroEditorProps) {
    return (
        <div className="space-y-6 md:p-1">
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label>Badge Text</Label>
                    <Input 
                        value={content.badgeText || ''} 
                        onChange={(e) => onUpdate({ badgeText: e.target.value })} 
                        placeholder="e.g. Join the Voyage"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Hero Title</Label>
                <Input 
                    value={content.title || ''} 
                    onChange={(e) => onUpdate({ title: e.target.value })} 
                    placeholder="e.g. Map the Future with Us"
                />
            </div>

            <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                    value={content.description || ''} 
                    onChange={(e) => onUpdate({ description: e.target.value })} 
                    placeholder="Describe the partnership vision..."
                    rows={4}
                />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 pt-4 border-t">
                <div className="space-y-4">
                    <Label className="text-base font-bold">Primary CTA</Label>
                    <div className="space-y-2">
                        <Label>Label</Label>
                        <Input 
                            value={content.cta1?.text || ''} 
                            onChange={(e) => onUpdate({ cta1: { ...content.cta1, text: e.target.value } as any })} 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Link</Label>
                        <Input 
                            value={content.cta1?.href || ''} 
                            onChange={(e) => onUpdate({ cta1: { ...content.cta1, href: e.target.value } as any })} 
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <Label className="text-base font-bold">Secondary CTA</Label>
                    <div className="space-y-2">
                        <Label>Label</Label>
                        <Input 
                            value={content.cta2?.text || ''} 
                            onChange={(e) => onUpdate({ cta2: { ...content.cta2, text: e.target.value } as any })} 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Link</Label>
                        <Input 
                            value={content.cta2?.href || ''} 
                            onChange={(e) => onUpdate({ cta2: { ...content.cta2, href: e.target.value } as any })} 
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2 pt-4 border-t">
                <Label>Hero Image (Optional)</Label>
                <div className="flex gap-2">
                    <MediaLibrary 
                        onSelect={(asset: MediaAsset) => onUpdate({ image: asset.relative_url })}
                        trigger={
                            <Button type="button" variant="outline" size="sm" className="h-10">
                                <ImageIcon className="h-4 w-4 mr-2" /> 
                                {content.image ? 'Change' : 'Upload'}
                            </Button>
                        }
                    />
                    <Input 
                        className="flex-1" 
                        value={content.image || ''} 
                        onChange={(e) => onUpdate({ image: e.target.value })} 
                        placeholder="Image URL..." 
                    />
                </div>
            </div>
        </div>
    );
}
