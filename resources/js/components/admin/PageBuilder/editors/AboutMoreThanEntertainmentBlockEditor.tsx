import React from 'react';
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/Components/ui/button";
import { Plus, Trash2, GripVertical, Image as ImageIcon } from 'lucide-react';
import type { AboutMoreThanEntertainmentBlock } from '@/types/page-blocks';
import MediaLibrary from '@/Components/admin/MediaLibrary';
import type { MediaAsset } from '@/types';

interface AboutMoreThanEntertainmentBlockEditorProps {
    content: AboutMoreThanEntertainmentBlock['content'];
    onUpdate: (updates: Partial<AboutMoreThanEntertainmentBlock['content']>) => void;
}

export default function AboutMoreThanEntertainmentBlockEditor({ content, onUpdate }: AboutMoreThanEntertainmentBlockEditorProps) {
    const handleCardChange = (index: number, updates: Partial<{ title: string; subtitle: string; image: string; link: string }>) => {
        const newCards = [...(content.cards || [])];
        newCards[index] = { ...newCards[index], ...updates };
        onUpdate({ cards: newCards });
    };

    const addCard = () => {
        onUpdate({ cards: [...(content.cards || []), { title: '', subtitle: '', image: '', link: '#' }] });
    };

    const removeCard = (index: number) => {
        const newCards = (content.cards || []).filter((_, i) => i !== index);
        onUpdate({ cards: newCards });
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>Section Title</Label>
                <Input 
                    value={content.title || ''} 
                    onChange={(e) => onUpdate({ title: e.target.value })} 
                    placeholder="e.g. More Than Entertainment"
                />
            </div>

            <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                    value={content.description || ''} 
                    onChange={(e) => onUpdate({ description: e.target.value })} 
                    placeholder="Section description..."
                    rows={3}
                />
            </div>

            <div className="space-y-4 pt-4 border-t">
                <Label>Feature Cards</Label>
                <div className="space-y-4">
                    {(content.cards || []).map((card, index) => (
                        <div key={index} className="p-4 border rounded-lg bg-surface-container-lowest space-y-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <GripVertical className="h-4 w-4 text-muted-foreground mr-2" />
                                    <span className="text-sm font-bold">Card #{index + 1}</span>
                                </div>
                                <Button 
                                    type="button"
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => removeCard(index)}
                                    className="text-destructive h-8 w-8 p-0"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                            
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="text-xs">Title</Label>
                                    <Input 
                                        value={card.title || ''} 
                                        onChange={(e) => handleCardChange(index, { title: e.target.value })}
                                        placeholder="Card Title"
                                        className="h-9"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Subtitle</Label>
                                    <Input 
                                        value={card.subtitle || ''} 
                                        onChange={(e) => handleCardChange(index, { subtitle: e.target.value })}
                                        placeholder="Card Subtitle"
                                        className="h-9"
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <Label className="text-xs">Image</Label>
                                <div className="flex gap-2">
                                    <MediaLibrary 
                                        onSelect={(asset: MediaAsset) => handleCardChange(index, { image: asset.relative_url })}
                                        trigger={
                                            <Button type="button" variant="outline" size="sm" className="h-9">
                                                <ImageIcon className="h-4 w-4 mr-2" /> 
                                                {card.image ? 'Change' : 'Upload'}
                                            </Button>
                                        }
                                    />
                                    <Input 
                                        className="flex-1 h-9" 
                                        value={card.image || ''} 
                                        onChange={(e) => handleCardChange(index, { image: e.target.value })} 
                                        placeholder="Image URL..." 
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs">Link</Label>
                                <Input 
                                    value={card.link || ''} 
                                    onChange={(e) => handleCardChange(index, { link: e.target.value })}
                                    placeholder="e.g. #"
                                    className="h-9"
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addCard} className="w-full h-10 border-dashed">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Card
                </Button>
            </div>
        </div>
    );
}
