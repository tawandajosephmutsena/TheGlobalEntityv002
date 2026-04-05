import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash, ImageIcon } from 'lucide-react';
import MediaLibrary from '@/components/admin/MediaLibrary';
import { MediaAsset } from '@/types';
import { FlipRevealBlock } from '@/types/page-blocks';

interface FlipRevealBlockEditorProps {
    content: FlipRevealBlock['content'];
    onUpdate: (updates: Partial<FlipRevealBlock['content']>) => void;
}

const FlipRevealBlockEditor = ({ content, onUpdate }: FlipRevealBlockEditorProps) => {
    const updateContent = (updates: Partial<FlipRevealBlock['content']>) => {
        onUpdate({ ...content, ...updates });
    };

    const categories = content.categories || [];
    const items = content.items || [];

    const addCategory = () => {
        const id = `cat-${Date.now()}`;
        updateContent({
            categories: [...categories, { id, label: 'New Category' }]
        });
    };

    const removeCategory = (id: string) => {
        updateContent({
            categories: categories.filter(c => c.id !== id),
            items: items.map(item => item.category === id ? { ...item, category: 'all' } : item)
        });
    };

    const updateCategory = (id: string, label: string) => {
        updateContent({
            categories: categories.map(c => c.id === id ? { ...c, label } : c)
        });
    };

    const addItem = () => {
        const id = `item-${Date.now()}`;
        updateContent({
            items: [...items, { id, category: 'all', image: 'https://images.unsplash.com/photo-1696086152504-4843b2106ab4?q=80&w=600', title: 'New Item' }]
        });
    };

    const removeItem = (id: string) => {
        updateContent({
            items: items.filter(i => i.id !== id)
        });
    };

    const updateItem = (id: string, updates: Partial<FlipRevealBlock['content']['items'][number]>) => {
        updateContent({
            items: items.map(i => i.id === id ? { ...i, ...updates } : i)
        });
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                        value={content.title || ''}
                        onChange={(e) => updateContent({ title: e.target.value })}
                        placeholder="Section Title"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Subtitle</Label>
                    <Textarea
                        value={content.subtitle || ''}
                        onChange={(e) => updateContent({ subtitle: e.target.value })}
                        placeholder="Section Subtitle"
                    />
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                    <Label className="text-sm font-bold uppercase tracking-wider">Categories</Label>
                    <Button variant="outline" size="sm" onClick={addCategory}>
                        <Plus className="h-3 w-3 mr-1" /> Add Category
                    </Button>
                </div>
                <div className="space-y-2">
                    {categories.map((cat) => (
                        <div key={cat.id} className="flex gap-2 items-center">
                            <Input
                                value={cat.label}
                                onChange={(e) => updateCategory(cat.id, e.target.value)}
                                className="h-8"
                            />
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeCategory(cat.id)}>
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                    <Label className="text-sm font-bold uppercase tracking-wider">Gallery Items</Label>
                    <Button variant="outline" size="sm" onClick={addItem}>
                        <Plus className="h-3 w-3 mr-1" /> Add Item
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {items.map((item) => (
                        <div key={item.id} className="p-4 border rounded-lg bg-muted/20 space-y-4 relative group">
                            <Button
                                variant="destructive"
                                size="icon"
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeItem(item.id)}
                            >
                                <Trash className="h-3 w-3" />
                            </Button>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs">Category</Label>
                                    <select
                                        title="Item Category"
                                        className="w-full h-8 text-xs bg-background border rounded-md px-2 focus:ring-1 focus:ring-ring"
                                        value={item.category}
                                        onChange={(e) => updateItem(item.id, { category: e.target.value })}
                                    >
                                        <option value="all">All</option>
                                        {categories.map(c => (
                                            <option key={c.id} value={c.id}>{c.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Title</Label>
                                    <Input
                                        className="h-8 text-xs"
                                        value={item.title || ''}
                                        onChange={(e) => updateItem(item.id, { title: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs">Image</Label>
                                <div className="flex gap-2">
                                    <MediaLibrary
                                        onSelect={(asset: MediaAsset) => updateItem(item.id, { image: asset.relative_url })}
                                        trigger={
                                            <Button size="sm" variant="outline" className="h-8 text-xs shrink-0">
                                                <ImageIcon className="h-3 w-3 mr-1" /> Choose
                                            </Button>
                                        }
                                    />
                                    <Input
                                        className="h-8 text-xs"
                                        value={item.image}
                                        onChange={(e) => updateItem(item.id, { image: e.target.value })}
                                        placeholder="Image URL..."
                                    />
                                </div>
                                {item.image && (
                                    <div className="mt-2 aspect-video rounded-md overflow-hidden bg-muted">
                                        <img src={item.image} alt="" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FlipRevealBlockEditor;
