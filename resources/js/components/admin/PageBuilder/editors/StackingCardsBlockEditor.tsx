import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, ImageIcon } from 'lucide-react';
import { StackingCardsBlock } from '@/types/page-blocks';
import { Textarea } from '@/components/ui/textarea';
import MediaLibrary from '@/components/admin/MediaLibrary';
import { MediaAsset } from '@/types';

interface Props {
    content: StackingCardsBlock['content'];
    onUpdate: (updates: Partial<StackingCardsBlock['content']>) => void;
}

const StackingCardsBlockEditor = ({ content, onUpdate }: Props) => {
    const updateContent = (updates: Partial<StackingCardsBlock['content']>) => {
        onUpdate({ ...content, ...updates });
    };

    const addCard = () => {
        const cards = content.cards || [];
        updateContent({ 
            cards: [
                ...cards, 
                { 
                    bgColor: 'bg-[#0015ff]', 
                    title: 'New Card', 
                    description: 'Card description here',
                    imageSrc: ''
                }
            ] 
        });
    };

    const updateCard = (index: number, key: keyof NonNullable<StackingCardsBlock['content']['cards']>[0], value: string) => {
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
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Scroll Banner Text</Label>
                    <Input
                        value={content.scrollText || ''}
                        onChange={(e) => updateContent({ scrollText: e.target.value })}
                        placeholder="E.g., Scroll down ↓"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Footer Text</Label>
                    <Input
                        value={content.footerText || ''}
                        onChange={(e) => updateContent({ footerText: e.target.value })}
                        placeholder="E.g., fancy"
                    />
                </div>
            </div>

            <div className="space-y-4 border p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between">
                    <Label>Stacking Cards List</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addCard}>
                        <Plus className="h-4 w-4 mr-1" /> Add Card
                    </Button>
                </div>
                
                <div className="space-y-4">
                    {(content.cards || []).map((card, index) => (
                        <div key={index} className="space-y-4 p-4 bg-background border rounded-lg relative flex flex-col pt-10">
                            <div className="absolute top-2 left-4 text-xs font-bold text-muted-foreground uppercase">
                                Card {index + 1}
                            </div>
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
                                    <Label>Background Color (Tailwind class)</Label>
                                    <Input
                                        value={card.bgColor}
                                        onChange={(e) => updateCard(index, 'bgColor', e.target.value)}
                                        placeholder="E.g., bg-[#f97316] or bg-primary"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Description</Label>
                                    <Textarea
                                        value={card.description}
                                        onChange={(e) => updateCard(index, 'description', e.target.value)}
                                        rows={2}
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Card Image</Label>
                                    <div className="flex gap-2">
                                        <MediaLibrary
                                            onSelect={(asset: MediaAsset) => updateCard(index, 'imageSrc', asset.url)}
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
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StackingCardsBlockEditor;
