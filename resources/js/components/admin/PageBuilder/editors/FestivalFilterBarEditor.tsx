import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from 'lucide-react';
import type { FestivalFilterBarBlock } from '@/types/page-blocks';

interface FestivalFilterBarEditorProps {
    content: FestivalFilterBarBlock['content'];
    onUpdate: (updates: Partial<FestivalFilterBarBlock['content']>) => void;
}

export default function FestivalFilterBarEditor({ content, onUpdate }: FestivalFilterBarEditorProps) {
    const updateCategory = (index: number, updates: any) => {
        const newCategories = [...(content.categories || [])];
        newCategories[index] = { ...newCategories[index], ...updates };
        onUpdate({ categories: newCategories });
    };

    const addCategory = () => {
        const newItem = {
            id: crypto.randomUUID(),
            label: 'NEW CATEGORY',
            count: '00'
        };
        onUpdate({ categories: [...(content.categories || []), newItem] });
    };

    const removeCategory = (index: number) => {
        const newCategories = [...(content.categories || [])].filter((_, i) => i !== index);
        onUpdate({ categories: newCategories });
    };

    return (
        <div className="space-y-6 md:p-1">
            <div className="space-y-2">
                <Label>Search Placeholder</Label>
                <Input 
                    value={content.searchPlaceholder || ''} 
                    onChange={(e) => onUpdate({ searchPlaceholder: e.target.value })} 
                    placeholder="SEARCH ARCHIVES..."
                />
            </div>

            <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                    <Label className="text-lg font-bold">Category Pills</Label>
                    <Button variant="outline" size="sm" type="button" onClick={addCategory}>
                        <Plus size={14} className="mr-2" /> Add Category
                    </Button>
                </div>
                
                <div className="space-y-4">
                    {(content.categories || []).map((cat, index) => (
                        <div key={cat.id} className="p-4 border rounded-xl bg-muted/20 relative group">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                type="button"
                                className="absolute top-2 right-2 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeCategory(index)}
                            >
                                <Trash2 size={14} />
                            </Button>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Label</Label>
                                    <Input 
                                        value={cat.label} 
                                        onChange={(e) => updateCategory(index, { label: e.target.value })} 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Count (string)</Label>
                                    <Input 
                                        value={cat.count} 
                                        onChange={(e) => updateCategory(index, { count: e.target.value })} 
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
