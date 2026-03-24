import React from 'react';
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Plus, Trash2, GripVertical } from 'lucide-react';
import type { AboutWhoAreYouBlock } from '@/types/page-blocks';

interface AboutWhoAreYouBlockEditorProps {
    content: AboutWhoAreYouBlock['content'];
    onUpdate: (updates: Partial<AboutWhoAreYouBlock['content']>) => void;
}

export default function AboutWhoAreYouBlockEditor({ content, onUpdate }: AboutWhoAreYouBlockEditorProps) {
    const handleItemChange = (index: number, updates: Partial<{ title: string; description: string; colorClass: string }>) => {
        const newItems = [...(content.items || [])];
        newItems[index] = { ...newItems[index], ...updates };
        onUpdate({ items: newItems });
    };

    const addItem = () => {
        onUpdate({ items: [...(content.items || []), { title: '', description: '', colorClass: 'text-primary' }] });
    };

    const removeItem = (index: number) => {
        const newItems = (content.items || []).filter((_, i) => i !== index);
        onUpdate({ items: newItems });
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>Section Title</Label>
                <Input 
                    value={content.title || ''} 
                    onChange={(e) => onUpdate({ title: e.target.value })} 
                    placeholder="e.g. Who Are You?"
                />
            </div>

            <div className="space-y-4 pt-4 border-t">
                <Label>Dynamic Cards</Label>
                <div className="space-y-4">
                    {(content.items || []).map((item, index) => (
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
                                    onClick={() => removeItem(index)}
                                    className="text-destructive h-8 w-8 p-0"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                            
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="text-xs">Title</Label>
                                    <Input 
                                        value={item.title || ''} 
                                        onChange={(e) => handleItemChange(index, { title: e.target.value })}
                                        placeholder="Card Title"
                                        className="h-9"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Color Class (Tailwind)</Label>
                                    <Input 
                                        value={item.colorClass || ''} 
                                        onChange={(e) => handleItemChange(index, { colorClass: e.target.value })}
                                        placeholder="e.g. text-primary"
                                        className="h-9"
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <Label className="text-xs">Description</Label>
                                <Input 
                                    value={item.description || ''} 
                                    onChange={(e) => handleItemChange(index, { description: e.target.value })}
                                    placeholder="Card Description"
                                    className="h-9"
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addItem} className="w-full h-10 border-dashed">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Card
                </Button>
            </div>
        </div>
    );
}
