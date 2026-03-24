import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from 'lucide-react';
import type { FestivalArchiveHeroBlock } from '@/types/page-blocks';

interface FestivalArchiveHeroEditorProps {
    content: FestivalArchiveHeroBlock['content'];
    onUpdate: (updates: Partial<FestivalArchiveHeroBlock['content']>) => void;
}

export default function FestivalArchiveHeroEditor({ content, onUpdate }: FestivalArchiveHeroEditorProps) {
    const updateMarginalia = (index: number, updates: any) => {
        const newMarginalia = [...(content.marginalia || [])];
        newMarginalia[index] = { ...newMarginalia[index], ...updates };
        onUpdate({ marginalia: newMarginalia });
    };

    const addMarginalia = () => {
        const newItem = {
            id: crypto.randomUUID(),
            type: 'text' as const,
            content: 'NEW FRAGMENT',
            position: { x: '50%', y: '50%' },
            rotation: 0,
            parallaxSpeed: 1
        };
        onUpdate({ marginalia: [...(content.marginalia || []), newItem] });
    };

    const removeMarginalia = (index: number) => {
        const newMarginalia = [...(content.marginalia || [])].filter((_, i) => i !== index);
        onUpdate({ marginalia: newMarginalia });
    };

    return (
        <div className="space-y-6 md:p-1">
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label>Badge</Label>
                    <Input 
                        value={content.badge || ''} 
                        onChange={(e) => onUpdate({ badge: e.target.value })} 
                        placeholder="e.g. Ethereal Archive"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Hero Title</Label>
                <Textarea 
                    value={content.title || ''} 
                    onChange={(e) => onUpdate({ title: e.target.value })} 
                    placeholder="FESTIVAL\nMAP ARCHIVE"
                    rows={2}
                />
                <p className="text-xs text-muted-foreground">Use \n for line breaks</p>
            </div>

            <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                    value={content.description || ''} 
                    onChange={(e) => onUpdate({ description: e.target.value })} 
                    placeholder="Step into the shifting corridors..."
                    rows={3}
                />
            </div>

            <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                    <Label className="text-lg font-bold">Floating Marginalia</Label>
                    <Button variant="outline" size="sm" type="button" onClick={addMarginalia}>
                        <Plus size={14} className="mr-2" /> Add Fragment
                    </Button>
                </div>
                
                <div className="space-y-4">
                    {(content.marginalia || []).map((item, index) => (
                        <div key={item.id} className="p-4 border rounded-xl bg-muted/20 relative group">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                type="button"
                                className="absolute top-2 right-2 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeMarginalia(index)}
                                title="Remove marginalia fragment"
                            >
                                <Trash2 size={14} />
                            </Button>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2 sm:col-span-2">
                                    <Label>Content</Label>
                                    <Input 
                                        value={item.content} 
                                        onChange={(e) => updateMarginalia(index, { content: e.target.value })} 
                                        title="Marginalia fragment content"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Type</Label>
                                    <select 
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={item.type}
                                        onChange={(e) => updateMarginalia(index, { type: e.target.value as any })}
                                        title="Fragment type"
                                    >
                                        <option value="text">Text Fragment</option>
                                        <option value="stamp">Authentic Stamp</option>
                                        <option value="image">Floating Image (URL)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Rotation (deg)</Label>
                                    <Input 
                                        type="number"
                                        value={item.rotation || 0} 
                                        onChange={(e) => updateMarginalia(index, { rotation: parseInt(e.target.value) })} 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Position X (%)</Label>
                                    <Input 
                                        value={item.position.x} 
                                        onChange={(e) => updateMarginalia(index, { position: { ...item.position, x: e.target.value } })} 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Position Y (%)</Label>
                                    <Input 
                                        value={item.position.y} 
                                        onChange={(e) => updateMarginalia(index, { position: { ...item.position, y: e.target.value } })} 
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
