import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { EnterprisePricingBlock } from '@/types/page-blocks';

interface Props {
    content: EnterprisePricingBlock['content'];
    onUpdate: (updates: Partial<EnterprisePricingBlock['content']>) => void;
}

const EnterprisePricingBlockEditor = ({ content, onUpdate }: Props) => {
    const updateContent = (updates: Partial<EnterprisePricingBlock['content']>) => {
        onUpdate({ ...content, ...updates });
    };

    const addFeature = () => {
        const features = content.features || [];
        updateContent({ features: [...features, { text: 'New feature limitation' }] });
    };

    const updateFeature = (index: number, text: string) => {
        const features = [...(content.features || [])];
        features[index] = { text };
        updateContent({ features });
    };

    const removeFeature = (index: number) => {
        const features = [...(content.features || [])];
        features.splice(index, 1);
        updateContent({ features });
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>Section Heading</Label>
                <Input
                    value={content.heading || ''}
                    onChange={(e) => updateContent({ heading: e.target.value })}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Plan Name</Label>
                    <Input
                        value={content.planName || ''}
                        onChange={(e) => updateContent({ planName: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Plan Description</Label>
                    <Input
                        value={content.planDescription || ''}
                        onChange={(e) => updateContent({ planDescription: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Price Amount</Label>
                    <Input
                        type="number"
                        value={content.priceAmount || ''}
                        onChange={(e) => updateContent({ priceAmount: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Price Currency (Symbol)</Label>
                    <Input
                        value={content.priceCurrency || ''}
                        onChange={(e) => updateContent({ priceCurrency: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Button Text</Label>
                    <Input
                        value={content.buttonText || ''}
                        onChange={(e) => updateContent({ buttonText: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Button Link</Label>
                    <Input
                        value={content.buttonLink || ''}
                        onChange={(e) => updateContent({ buttonLink: e.target.value })}
                        placeholder="https://"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Footer Text (Below Button)</Label>
                <Textarea
                    value={content.featuresText || ''}
                    onChange={(e) => updateContent({ featuresText: e.target.value })}
                    rows={2}
                />
            </div>

            <div className="space-y-4 border p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between">
                    <Label>Features List</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                        <Plus className="h-4 w-4 mr-1" /> Add Feature
                    </Button>
                </div>
                <div className="space-y-3">
                    {(content.features || []).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <Input
                                value={feature.text}
                                onChange={(e) => updateFeature(index, e.target.value)}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFeature(index)}
                                className="shrink-0 text-destructive"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <Label>Trusted Text (Below Features)</Label>
                <Textarea
                    value={content.trustedText || ''}
                    onChange={(e) => updateContent({ trustedText: e.target.value })}
                    rows={2}
                />
            </div>
        </div>
    );
};

export default EnterprisePricingBlockEditor;
