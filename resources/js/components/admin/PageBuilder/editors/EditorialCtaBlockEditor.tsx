import React from 'react';
import type { EditorialCtaBlock } from '@/types/page-blocks';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, X } from 'lucide-react';

interface Props {
    content: EditorialCtaBlock['content'];
    onUpdate: (updates: Partial<EditorialCtaBlock['content']>) => void;
}

export default function EditorialCtaBlockEditor({ content, onUpdate }: Props) {
    const defaultContent = {
        badgeText: "Join the Movement",
        title: "Ready to start your journey?",
        description: "Join a global community of explorers and creators. Discover unique experiences and connect with like-minded individuals across the world.",
        features: ["Community Access", "Exclusive Events", "Global Network"],
        buttonText: "Get Started",
        buttonLink: "/register",
        footerText: "No commitment required, join thousands of others already exploring.",
        trustIndicatorNumber: "10,000+",
        trustIndicatorText: "active explorers and growing"
    };

    const mergedContent = { ...defaultContent, ...content };

    const updateContent = <K extends keyof EditorialCtaBlock['content']>(key: K, value: EditorialCtaBlock['content'][K]) => {
        onUpdate({ [key]: value });
    };

    const addFeature = () => {
        const currentFeatures = mergedContent.features || [];
        updateContent('features', [...currentFeatures, 'New Feature']);
    };

    const updateFeature = (index: number, value: string) => {
        const currentFeatures = [...(mergedContent.features || [])];
        currentFeatures[index] = value;
        updateContent('features', currentFeatures);
    };

    const removeFeature = (index: number) => {
        const currentFeatures = [...(mergedContent.features || [])];
        currentFeatures.splice(index, 1);
        updateContent('features', currentFeatures);
    };

    return (
        <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium mb-4">Header Content</h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Badge Text</Label>
                            <Input
                                value={mergedContent.badgeText || ''}
                                onChange={(e) => updateContent('badgeText', e.target.value)}
                                placeholder="Join the Movement"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                                value={mergedContent.title || ''}
                                onChange={(e) => updateContent('title', e.target.value)}
                                placeholder="Ready to start your journey?"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                value={mergedContent.description || ''}
                                onChange={(e) => updateContent('description', e.target.value)}
                                placeholder="Join a global community..."
                                rows={3}
                            />
                        </div>
                    </div>
                </div>

                <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium">Features List</h3>
                        <Button variant="outline" size="sm" onClick={addFeature}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Feature
                        </Button>
                    </div>
                    
                    <div className="space-y-3">
                        {mergedContent.features?.map((feature, index) => (
                            <div key={index} className="flex gap-2">
                                <Input
                                    value={feature}
                                    onChange={(e) => updateFeature(index, e.target.value)}
                                    placeholder="Feature text"
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeFeature(index)}
                                    className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        {(!mergedContent.features || mergedContent.features.length === 0) && (
                            <p className="text-sm text-muted-foreground italic">No features added. Click "Add Feature" to create one.</p>
                        )}
                    </div>
                </div>

                <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">CTA Button Settings</h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Button Text</Label>
                            <Input
                                value={mergedContent.buttonText || ''}
                                onChange={(e) => updateContent('buttonText', e.target.value)}
                                placeholder="Get Started"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Button Link</Label>
                            <Input
                                value={mergedContent.buttonLink || ''}
                                onChange={(e) => updateContent('buttonLink', e.target.value)}
                                placeholder="/register"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Footer/Subtext</Label>
                            <Input
                                value={mergedContent.footerText || ''}
                                onChange={(e) => updateContent('footerText', e.target.value)}
                                placeholder="No commitment required..."
                            />
                        </div>
                    </div>
                </div>

                <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">Trust Indicator (Bottom)</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Highlighted Number</Label>
                            <Input
                                value={mergedContent.trustIndicatorNumber || ''}
                                onChange={(e) => updateContent('trustIndicatorNumber', e.target.value)}
                                placeholder="10,000+"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Accompanying Text</Label>
                            <Input
                                value={mergedContent.trustIndicatorText || ''}
                                onChange={(e) => updateContent('trustIndicatorText', e.target.value)}
                                placeholder="active explorers and growing"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </ScrollArea>
    );
}
