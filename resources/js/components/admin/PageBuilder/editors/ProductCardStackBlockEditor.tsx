import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, ImageIcon, GripVertical } from 'lucide-react';
import { ProductCardStackBlock } from '@/types/page-blocks';
import MediaLibrary from '@/components/admin/MediaLibrary';
import { MediaAsset } from '@/types';

interface Props {
    content: ProductCardStackBlock['content'];
    onUpdate: (updates: Partial<ProductCardStackBlock['content']>) => void;
}

const ProductCardStackBlockEditor = ({ content, onUpdate }: Props) => {
    const updateContent = (updates: Partial<ProductCardStackBlock['content']>) => {
        onUpdate({ ...content, ...updates });
    };

    const addCard = () => {
        const cards = content.cards || [];
        updateContent({ 
            cards: [
                ...cards, 
                { 
                    id: `prod-${Date.now()}`,
                    title: 'New Product', 
                    subtitle: 'Product subtitle',
                    imageSrc: '',
                    specs: [
                        { label: 'Speed', value: 'Instant' },
                        { label: 'Feature', value: 'Value' }
                    ]
                }
            ] 
        });
    };

    const updateCard = (index: number, key: keyof NonNullable<ProductCardStackBlock['content']['cards']>[0], value: any) => {
        const cards = [...(content.cards || [])];
        cards[index] = { ...cards[index], [key]: value };
        updateContent({ cards });
    };

    const removeCard = (index: number) => {
        const cards = [...(content.cards || [])];
        cards.splice(index, 1);
        updateContent({ cards });
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4 border p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between">
                    <Label>Product Cards List</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addCard}>
                        <Plus className="h-4 w-4 mr-1" /> Add Card
                    </Button>
                </div>
                
                <div className="space-y-6">
                    {(content.cards || []).map((card, index) => (
                        <div key={card.id || index} className="space-y-4 p-4 bg-background border rounded-lg relative pt-10">
                            <div className="absolute left-4 top-2 text-xs font-bold text-muted-foreground">Product #{index + 1}</div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeCard(index)}
                                className="absolute right-2 top-2 h-8 w-8 text-destructive"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            
                            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Title</Label>
                                    <Input
                                        value={card.title}
                                        onChange={(e) => updateCard(index, 'title', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Subtitle</Label>
                                    <Input
                                        value={card.subtitle}
                                        onChange={(e) => updateCard(index, 'subtitle', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Card Image</Label>
                                    <div className="flex gap-2">
                                        <MediaLibrary
                                            onSelect={(asset: MediaAsset) => updateCard(index, 'imageSrc', asset.relative_url)}
                                            trigger={
                                                <Button size="sm" variant="outline" className="h-8 text-xs shrink-0">
                                                    <ImageIcon className="h-3 w-3 mr-1" /> Choose
                                                </Button>
                                            }
                                        />
                                        <Input
                                            className="h-8 text-xs flex-1"
                                            value={card.imageSrc}
                                            onChange={(e) => updateCard(index, 'imageSrc', e.target.value)}
                                            placeholder="Image URL..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3 md:col-span-2 p-3 bg-muted/30 rounded-lg">
                                    <Label>Specifications (Max 4 recommended)</Label>
                                    {(card.specs || []).map((spec, specIndex) => (
                                        <div key={specIndex} className="flex items-center gap-2">
                                            <Input
                                                placeholder="Label"
                                                value={spec.label}
                                                onChange={(e) => {
                                                    const newSpecs = [...(card.specs || [])];
                                                    newSpecs[specIndex].label = e.target.value;
                                                    updateCard(index, 'specs', newSpecs);
                                                }}
                                                className="w-1/2"
                                            />
                                            <Input
                                                placeholder="Value"
                                                value={spec.value}
                                                onChange={(e) => {
                                                    const newSpecs = [...(card.specs || [])];
                                                    newSpecs[specIndex].value = e.target.value;
                                                    updateCard(index, 'specs', newSpecs);
                                                }}
                                                className="w-1/2"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    const newSpecs = [...(card.specs || [])];
                                                    newSpecs.splice(specIndex, 1);
                                                    updateCard(index, 'specs', newSpecs);
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="w-full mt-2"
                                        onClick={() => {
                                            const newSpecs = [...(card.specs || [])];
                                            newSpecs.push({ label: 'New Spec', value: 'Value' });
                                            updateCard(index, 'specs', newSpecs);
                                        }}
                                    >
                                        <Plus className="h-3 w-3 mr-1" /> Add Spec
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductCardStackBlockEditor;
