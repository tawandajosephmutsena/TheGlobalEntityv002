import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash, ImageIcon } from 'lucide-react';
import MediaLibrary from '@/components/admin/MediaLibrary';
import { MediaAsset } from '@/types';
import { Feature108Block } from '@/types/page-blocks';

interface Feature108EditorProps {
    content: Feature108Block['content'];
    onUpdate: (updates: Partial<Feature108Block['content']>) => void;
}

const Feature108Editor = ({ content, onUpdate }: Feature108EditorProps) => {
    const updateContent = (updates: Partial<Feature108Block['content']>) => {
        onUpdate({ ...content, ...updates });
    };

    const tabs = content.tabs || [];

    const addTab = () => {
        const newTab: NonNullable<Feature108Block['content']['tabs']>[number] = {
            value: `tab-${tabs.length + 1}`,
            icon: 'Zap',
            label: 'New Tab',
            content: {
                badge: 'New Badge',
                title: 'New Title',
                description: 'New Description',
                buttonText: 'Click Me',
                imageSrc: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80',
                imageAlt: 'placeholder',
            },
        };
        updateContent({ tabs: [...tabs, newTab] });
    };

    const removeTab = (index: number) => {
        const newTabs = [...tabs];
        newTabs.splice(index, 1);
        updateContent({ tabs: newTabs });
    };

    const updateTab = (index: number, tabUpdates: Partial<NonNullable<Feature108Block['content']['tabs']>[number]>) => {
        const newTabs = [...tabs];
        newTabs[index] = { ...newTabs[index], ...tabUpdates };
        updateContent({ tabs: newTabs });
    };

    const updateTabContent = (index: number, contentUpdates: Partial<NonNullable<Feature108Block['content']['tabs']>[number]['content']>) => {
        const newTabs = [...tabs];
        newTabs[index] = {
            ...newTabs[index],
            content: { ...newTabs[index].content, ...contentUpdates },
        };
        updateContent({ tabs: newTabs });
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>Section Badge</Label>
                <Input
                    value={content.badge || ''}
                    onChange={(e) => updateContent({ badge: e.target.value })}
                />
            </div>
            <div className="space-y-2">
                <Label>Heading</Label>
                <Input
                    value={content.heading || ''}
                    onChange={(e) => updateContent({ heading: e.target.value })}
                />
            </div>
            <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                    value={content.description || ''}
                    onChange={(e) => updateContent({ description: e.target.value })}
                />
            </div>

            <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold uppercase tracking-wider">Tabs</Label>
                    <Button variant="outline" size="sm" onClick={addTab}>
                        <Plus className="h-3 w-3 mr-1" /> Add Tab
                    </Button>
                </div>

                <div className="space-y-4">
                    {tabs.map((tab: any, index: number) => (
                        <div key={index} className="p-4 border rounded-lg bg-muted/20 space-y-4 relative group">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeTab(index)}
                            >
                                <Trash className="h-3 w-3" />
                            </Button>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label className="text-[10px]">Tab Label</Label>
                                    <Input
                                        className="h-8 text-xs"
                                        value={tab.label}
                                        onChange={(e) => updateTab(index, { label: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px]">Icon (Lucide Name)</Label>
                                    <Input
                                        className="h-8 text-xs"
                                        value={tab.icon}
                                        onChange={(e) => updateTab(index, { icon: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t">
                                <div className="space-y-1">
                                    <Label className="text-[10px]">Content Badge</Label>
                                    <Input
                                        className="h-8 text-xs"
                                        value={tab.content.badge}
                                        onChange={(e) => updateTabContent(index, { badge: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px]">Content Title</Label>
                                    <Input
                                        className="h-8 text-xs"
                                        value={tab.content.title}
                                        onChange={(e) => updateTabContent(index, { title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px]">Content Description</Label>
                                    <Textarea
                                        className="h-16 text-xs"
                                        value={tab.content.description}
                                        onChange={(e) => updateTabContent(index, { description: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px]">Button Text</Label>
                                    <Input
                                        className="h-8 text-xs"
                                        value={tab.content.buttonText}
                                        onChange={(e) => updateTabContent(index, { buttonText: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px]">Image</Label>
                                    <div className="flex gap-2">
                                        <MediaLibrary
                                            onSelect={(asset: MediaAsset) => updateTabContent(index, { imageSrc: asset.url })}
                                            trigger={
                                                <Button size="sm" variant="outline" className="h-8 text-xs">
                                                    <ImageIcon className="h-3 w-3 mr-1" /> Choose
                                                </Button>
                                            }
                                        />
                                        <Input
                                            className="h-8 text-xs"
                                            value={tab.content.imageSrc}
                                            onChange={(e) => updateTabContent(index, { imageSrc: e.target.value })}
                                            placeholder="URL..."
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

export default Feature108Editor;
