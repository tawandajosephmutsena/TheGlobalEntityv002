import React from 'react';
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/Components/ui/button";
import { Plus, Trash2, GripVertical, Image as ImageIcon } from 'lucide-react';
import type { AboutOriginStoryBlock } from '@/types/page-blocks';
import MediaLibrary from '@/Components/admin/MediaLibrary';
import type { MediaAsset } from '@/types';

interface AboutOriginStoryBlockEditorProps {
    content: AboutOriginStoryBlock['content'];
    onUpdate: (updates: Partial<AboutOriginStoryBlock['content']>) => void;
}

export default function AboutOriginStoryBlockEditor({ content, onUpdate }: AboutOriginStoryBlockEditorProps) {
    const handleTimelineChange = (index: number, updates: Partial<{ year: string; event: string }>) => {
        const newTimeline = [...(content.timeline || [])];
        newTimeline[index] = { ...newTimeline[index], ...updates };
        onUpdate({ timeline: newTimeline });
    };

    const addTimelineItem = () => {
        onUpdate({ timeline: [...(content.timeline || []), { year: '', event: '' }] });
    };

    const removeTimelineItem = (index: number) => {
        const newTimeline = (content.timeline || []).filter((_, i) => i !== index);
        onUpdate({ timeline: newTimeline });
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>Section Title</Label>
                <Input 
                    value={content.title || ''} 
                    onChange={(e) => onUpdate({ title: e.target.value })} 
                    placeholder="e.g. The Origin Story"
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

            <div className="space-y-2 pt-4 border-t">
                <Label>Featured Image</Label>
                <div className="flex gap-2">
                    <MediaLibrary 
                        onSelect={(asset: MediaAsset) => onUpdate({ image: asset.url })}
                        trigger={
                            <Button type="button" variant="outline" size="sm" className="h-9">
                                <ImageIcon className="h-4 w-4 mr-2" /> 
                                {content.image ? 'Change' : 'Upload'}
                            </Button>
                        }
                    />
                    <Input 
                        className="flex-1 h-9" 
                        value={content.image || ''} 
                        onChange={(e) => onUpdate({ image: e.target.value })} 
                        placeholder="Image URL..." 
                    />
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
                <Label>Timeline Events</Label>
                <div className="space-y-4">
                    {(content.timeline || []).map((item, index) => (
                        <div key={index} className="p-4 border rounded-lg bg-surface-container-lowest space-y-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <GripVertical className="h-4 w-4 text-muted-foreground mr-2" />
                                    <span className="text-sm font-bold">Event #{index + 1}</span>
                                </div>
                                <Button 
                                    type="button"
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => removeTimelineItem(index)}
                                    className="text-destructive h-8 w-8 p-0"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                            
                            <div className="grid gap-4 sm:grid-cols-4">
                                <div className="space-y-2 sm:col-span-1">
                                    <Label className="text-xs">Year</Label>
                                    <Input 
                                        value={item.year || ''} 
                                        onChange={(e) => handleTimelineChange(index, { year: e.target.value })}
                                        placeholder="e.g. 2024"
                                        className="h-9"
                                    />
                                </div>
                                <div className="space-y-2 sm:col-span-3">
                                    <Label className="text-xs">Event Description</Label>
                                    <Input 
                                        value={item.event || ''} 
                                        onChange={(e) => handleTimelineChange(index, { event: e.target.value })}
                                        placeholder="What happened?"
                                        className="h-9"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addTimelineItem} className="w-full h-10 border-dashed">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Timeline Event
                </Button>
            </div>
        </div>
    );
}
