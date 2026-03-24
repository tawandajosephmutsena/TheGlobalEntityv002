import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface StitchCommunityReviewEditorProps {
    block: any;
    onUpdate: (updates: any) => void;
}

export default function StitchCommunityReviewEditor({ block, onUpdate }: StitchCommunityReviewEditorProps) {
    const handleUpdate = (field: string, value: any) => {
        onUpdate({
            ...block.content,
            [field]: value
        });
    };

    return (
        <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="stats">Stats</TabsTrigger>
                <TabsTrigger value="entry">Entry</TabsTrigger>
                <TabsTrigger value="more">More</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4 pt-4">
                <div className="grid gap-2">
                    <Label htmlFor="title">Block Title</Label>
                    <Input
                        id="title"
                        value={block.content.title || ''}
                        onChange={(e) => handleUpdate('title', e.target.value)}
                        placeholder="Voices from the Uncharted Trails."
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Textarea
                        id="subtitle"
                        value={block.content.subtitle || ''}
                        onChange={(e) => handleUpdate('subtitle', e.target.value)}
                        placeholder="Genuine stories from our community..."
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="limit">Review Limit</Label>
                    <Input
                        id="limit"
                        type="number"
                        min="1"
                        max="4"
                        value={block.content.limit || 4}
                        onChange={(e) => handleUpdate('limit', parseInt(e.target.value))}
                    />
                </div>
                <div className="pt-4 border-t space-y-4">
                    <Label className="text-xs uppercase tracking-widest opacity-50">Call to Action</Label>
                    <div className="grid gap-2">
                        <Label htmlFor="ctaTitle">CTA Title</Label>
                        <Input
                            id="ctaTitle"
                            value={block.content.ctaTitle || ''}
                            onChange={(e) => handleUpdate('ctaTitle', e.target.value)}
                            placeholder="e.g. Ready to start your own chapter?"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="ctaButtonText">CTA Button Text</Label>
                        <Input
                            id="ctaButtonText"
                            value={block.content.ctaButtonText || ''}
                            onChange={(e) => handleUpdate('ctaButtonText', e.target.value)}
                            placeholder="e.g. Join the Expedition"
                        />
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="stats" className="space-y-4 pt-4">
                <div className="grid gap-2">
                    <Label htmlFor="statsRating">Stats Rating</Label>
                    <Input
                        id="statsRating"
                        value={block.content.statsRating || ''}
                        onChange={(e) => handleUpdate('statsRating', e.target.value)}
                        placeholder="4.9"
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="statsTitle">Stats Title</Label>
                    <Input
                        id="statsTitle"
                        value={block.content.statsTitle || ''}
                        onChange={(e) => handleUpdate('statsTitle', e.target.value)}
                        placeholder="Unmatched Accuracy"
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="statsDescription">Stats Description</Label>
                    <Textarea
                        id="statsDescription"
                        value={block.content.statsDescription || ''}
                        onChange={(e) => handleUpdate('statsDescription', e.target.value)}
                        placeholder="Across 12,000+ trails..."
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="statsAvatars">Avatars (Comma Separated URLs)</Label>
                    <Textarea
                        id="statsAvatars"
                        value={(block.content.statsAvatars || []).join(', ')}
                        onChange={(e) => handleUpdate('statsAvatars', e.target.value.split(',').map((s: string) => s.trim()))}
                        placeholder="https://i.pravatar.cc/100?img=11, ..."
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="statsCount">Stats Count Label</Label>
                    <Input
                        id="statsCount"
                        value={block.content.statsCount || ''}
                        onChange={(e) => handleUpdate('statsCount', e.target.value)}
                        placeholder="+2k"
                    />
                </div>
            </TabsContent>

            <TabsContent value="entry" className="space-y-4 pt-4">
                <div className="grid gap-2">
                    <Label htmlFor="entryNumber">Entry Number</Label>
                    <Input
                        id="entryNumber"
                        value={block.content.entryNumber || ''}
                        onChange={(e) => handleUpdate('entryNumber', e.target.value)}
                        placeholder="402"
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="entryLocation">Entry Location</Label>
                    <Input
                        id="entryLocation"
                        value={block.content.entryLocation || ''}
                        onChange={(e) => handleUpdate('entryLocation', e.target.value)}
                        placeholder="The Misty Valley"
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="entryQuote">Entry Highlight Quote</Label>
                    <Textarea
                        id="entryQuote"
                        value={block.content.entryQuote || ''}
                        onChange={(e) => handleUpdate('entryQuote', e.target.value)}
                        placeholder="This isn't just an app; it's a silent partner..."
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="entryTags">Tags (Comma Separated)</Label>
                    <Input
                        id="entryTags"
                        value={(block.content.entryTags || []).join(', ')}
                        onChange={(e) => handleUpdate('entryTags', e.target.value.split(',').map((s: string) => s.trim()))}
                        placeholder="#Hiking, #Exploration"
                    />
                </div>
            </TabsContent>

            <TabsContent value="more" className="space-y-4 pt-4">
                <div className="grid gap-2">
                    <Label htmlFor="ratingCardImage">Rating Card Background Image</Label>
                    <Input
                        id="ratingCardImage"
                        value={block.content.ratingCardImage || ''}
                        onChange={(e) => handleUpdate('ratingCardImage', e.target.value)}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="ratingCardTitle">Rating Card Title</Label>
                    <Input
                        id="ratingCardTitle"
                        value={block.content.ratingCardTitle || ''}
                        onChange={(e) => handleUpdate('ratingCardTitle', e.target.value)}
                        placeholder="Rate your adventure"
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="ratingCardDescription">Rating Card Description</Label>
                    <Textarea
                        id="ratingCardDescription"
                        value={block.content.ratingCardDescription || ''}
                        onChange={(e) => handleUpdate('ratingCardDescription', e.target.value)}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="socialProofPlatform">Social Proof Platform</Label>
                    <Input
                        id="socialProofPlatform"
                        value={block.content.socialProofPlatform || ''}
                        onChange={(e) => handleUpdate('socialProofPlatform', e.target.value)}
                        placeholder="Shared on TrailChat Community"
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="footerCounterText">Footer Counter Text</Label>
                    <Input
                        id="footerCounterText"
                        value={block.content.footerCounterText || ''}
                        onChange={(e) => handleUpdate('footerCounterText', e.target.value)}
                        placeholder="45,000+ Reviews and counting"
                    />
                </div>
            </TabsContent>
        </Tabs>
    );
}
