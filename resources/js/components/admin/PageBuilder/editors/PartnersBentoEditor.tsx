import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import IconPicker from '@/components/admin/PageBuilder/IconPicker';
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
            iconType: 'lucide' as const,
            link: '#',
            variant: 'glass' as const
        };
        onUpdate({ cards: [...(content.cards || []), newCard] });
    };

    const removeCard = (index: number) => {
        const newCards = [...(content.cards || [])].filter((_, i) => i !== index);
        onUpdate({ cards: newCards });
    };

    return (
        <div className="space-y-6 md:p-1">
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label>Section Title</Label>
                    <Input 
                        value={content.title || ''} 
                        onChange={(e) => onUpdate({ title: e.target.value })} 
                    />
                </div>
                <div className="flex items-center gap-2 pt-8">
                    <Switch 
                        id="show-collaborate"
                        checked={content.showCollaborateButton ?? true}
                        onCheckedChange={(checked) => onUpdate({ showCollaborateButton: checked })}
                    />
                    <Label htmlFor="show-collaborate">Show Collaborate Buttons</Label>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 pt-4 border-t">
                <div className="space-y-2">
                    <Label>Response Label</Label>
                    <Input 
                        value={content.averageResponseLabel || ''} 
                        onChange={(e) => onUpdate({ averageResponseLabel: e.target.value })} 
                        placeholder="Average Response"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Response Time</Label>
                    <Input 
                        value={content.averageResponseValue || ''} 
                        onChange={(e) => onUpdate({ averageResponseValue: e.target.value })} 
                        placeholder="24-48 Moons"
                    />
                </div>
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
                                    <Label>Color Theme / Variant</Label>
                                    <Select 
                                        value={card.variant || 'glass'} 
                                        onValueChange={(value: any) => updateCard(index, { variant: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select variant" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="primary">Primary (Glow)</SelectItem>
                                            <SelectItem value="secondary">Secondary</SelectItem>
                                            <SelectItem value="tertiary">Tertiary</SelectItem>
                                            <SelectItem value="glass">Liquid Glass (Transparent)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Icon</Label>
                                    <IconPicker 
                                        value={card.icon} 
                                        type={card.iconType || 'lucide'}
                                        onChange={(val, type) => updateCard(index, { icon: val, iconType: type })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Link (Optional)</Label>
                                    <Input 
                                        value={card.link || ''} 
                                        onChange={(e) => updateCard(index, { link: e.target.value })} 
                                        placeholder="Leave empty to hide link"
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
