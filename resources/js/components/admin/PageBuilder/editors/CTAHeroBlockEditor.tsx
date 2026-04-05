import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical, Image as ImageIcon } from 'lucide-react';
import type { CTAHeroBlock } from '@/types/page-blocks';
import MediaLibrary from '@/components/admin/MediaLibrary';
import type { MediaAsset } from '@/types';

interface CTAHeroBlockEditorProps {
    content: CTAHeroBlock['content'];
    onUpdate: (updates: Partial<CTAHeroBlock['content']>) => void;
}

export default function CTAHeroBlockEditor({ content, onUpdate }: CTAHeroBlockEditorProps) {
    const handleBenefitChange = (index: number, value: string) => {
        const newBenefits = [...(content.benefits || [])];
        newBenefits[index] = value;
        onUpdate({ benefits: newBenefits });
    };

    const addBenefit = () => {
        onUpdate({ benefits: [...(content.benefits || []), ''] });
    };

    const removeBenefit = (index: number) => {
        const newBenefits = (content.benefits || []).filter((_, i) => i !== index);
        onUpdate({ benefits: newBenefits });
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label>Badge Text</Label>
                    <Input 
                        value={content.badge || ''} 
                        onChange={(e) => onUpdate({ badge: e.target.value })} 
                        placeholder="e.g. New Feature"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Email Placeholder</Label>
                    <Input 
                        value={content.emailPlaceholder || ''} 
                        onChange={(e) => onUpdate({ emailPlaceholder: e.target.value })} 
                        placeholder="e.g. Enter your email"
                    />
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label>Title Prefix</Label>
                    <Input 
                        value={content.titlePrefix || ''} 
                        onChange={(e) => onUpdate({ titlePrefix: e.target.value })} 
                        placeholder="e.g. Elevate Your"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Title Highlight</Label>
                    <Input 
                        value={content.titleHighlight || ''} 
                        onChange={(e) => onUpdate({ titleHighlight: e.target.value })} 
                        placeholder="e.g. Digital Presence"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                    value={content.description || ''} 
                    onChange={(e) => onUpdate({ description: e.target.value })} 
                    placeholder="Describe your offer..."
                    rows={3}
                />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label>Button Text</Label>
                    <Input 
                        value={content.buttonText || ''} 
                        onChange={(e) => onUpdate({ buttonText: e.target.value })} 
                        placeholder="e.g. Get Started"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Button Link</Label>
                    <Input 
                        value={content.buttonLink || ''} 
                        onChange={(e) => onUpdate({ buttonLink: e.target.value })} 
                        placeholder="e.g. /signup"
                    />
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label>Stats Value</Label>
                    <Input 
                        value={content.statsValue || ''} 
                        onChange={(e) => onUpdate({ statsValue: e.target.value })} 
                        placeholder="e.g. 4.9/5"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Stats Label</Label>
                    <Input 
                        value={content.statsLabel || ''} 
                        onChange={(e) => onUpdate({ statsLabel: e.target.value })} 
                        placeholder="e.g. from 2,000+ reviews"
                    />
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 pt-4 border-t">
                <div className="space-y-2">
                    <Label>Right Column Image</Label>
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
                <div className="space-y-2">
                    <Label>Image Link (Optional)</Label>
                    <Input 
                        value={content.imageLink || ''} 
                        onChange={(e) => onUpdate({ imageLink: e.target.value })} 
                        placeholder="e.g. /features/new"
                    />
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
                <Label>Benefits</Label>
                <div className="space-y-2">
                    {(content.benefits || []).map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                            <Input 
                                value={benefit} 
                                onChange={(e) => handleBenefitChange(index, e.target.value)}
                                placeholder="Benefit description"
                            />
                            <Button 
                                type="button"
                                variant="ghost" 
                                size="icon" 
                                onClick={() => removeBenefit(index)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addBenefit} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Benefit
                </Button>
            </div>
        </div>
    );
}
