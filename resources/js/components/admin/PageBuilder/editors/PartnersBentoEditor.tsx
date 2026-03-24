import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical } from 'lucide-react';
import type { PartnersBentoBlock } from '@/types/page-blocks';

interface PartnersBentoEditorProps {
    content: PartnersBentoBlock['content'];
    onUpdate: (updates: Partial<PartnersBentoBlock['content']>) => void;
}

export default function PartnersBentoEditor({ content, onUpdate }: PartnersBentoEditorProps) {
    const updateCard = (index: number, updates: any) => {
        const newCards = [...(content.cards || [])];
        newCards[index] = { ...newCards[index], ...updates };
        onUpdate({ cards: newCards });
    };

    const addCard = () => {
        const newCard = {
            id: crypto.randomUUID(),
            title: 'New Partner Category',
            description: 'Description of the partnership.',
            icon: 'map',
            link: '#'
        };
        onUpdate({ cards: [...(content.cards || []), newCard] });
    };

    const removeCard = (index: number) => {
        const newCards = [...(content.cards || [])].filter((_, i) => i !== index);
        onUpdate({ cards: newCards });
    };

    return (
        <div className="space-y-6 md:p-1">
            <div className="space-y-2">
                <Label>Section Title</Label>
                <Input 
                    value={content.title || ''} 
                    onChange={(e) => onUpdate({ title: e.target.value })} 
                />
            </div>

            <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                    <Label className="text-lg font-bold">Partner Cards</Label>
                    <span className="text-xs text-muted-foreground">Grid layout: 1st and 4th cards are wide</span>
                </div>
                
                <div className="space-y-6">
                    {(content.cards || []).map((card, index) => (
                        <div key={card.id} className="p-4 border rounded-xl bg-muted/20 relative group">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                type="button"
                                className="absolute top-2 right-2 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeCard(index)}
                            >
                                <Trash2 size={16} />
                            </Button>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Title</Label>
                                    <Input 
                                        value={card.title} 
                                        onChange={(e) => updateCard(index, { title: e.target.value })} 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Icon Name</Label>
                                    <Input 
                                        value={card.icon} 
                                        onChange={(e) => updateCard(index, { icon: e.target.value })} 
                                        placeholder="map, storefront, festival, shield"
                                    />
                                </div>
                                <div className="space-y-2 sm:col-span-2">
                                    <Label>Description</Label>
                                    <Textarea 
                                        value={card.description} 
                                        onChange={(e) => updateCard(index, { description: e.target.value })} 
                                        rows={2}
                                    />
                                </div>
                                <div className="space-y-2 sm:col-span-2">
                                    <Label>Link</Label>
                                    <Input 
                                        value={card.link || ''} 
                                        onChange={(e) => updateCard(index, { link: e.target.value })} 
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <Button variant="outline" type="button" className="w-full" onClick={addCard}>
                    <Plus size={16} className="mr-2" /> Add Partner Card
                </Button>
            </div>
        </div>
    );
}
