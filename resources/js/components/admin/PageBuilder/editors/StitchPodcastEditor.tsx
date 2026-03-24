import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface StitchPodcastEditorProps {
    block: any;
    onUpdate: (updates: any) => void;
}

export default function StitchPodcastEditor({ block, onUpdate }: StitchPodcastEditorProps) {
    const handleUpdate = (field: string, value: any) => {
        onUpdate({
            ...block.content,
            [field]: value
        });
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="title">Block Title</Label>
                    <Input
                        id="title"
                        value={block.content.title || ''}
                        onChange={(e) => handleUpdate('title', e.target.value)}
                        placeholder="e.g. Voices of the Wild."
                    />
                </div>
                
                <div className="grid gap-2">
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Textarea
                        id="subtitle"
                        value={block.content.subtitle || ''}
                        onChange={(e) => handleUpdate('subtitle', e.target.value)}
                        placeholder="e.g. Immersive audio journeys..."
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="limit">Number of items</Label>
                    <Input
                        id="limit"
                        type="number"
                        min="1"
                        max="6"
                        value={block.content.limit || 6}
                        onChange={(e) => handleUpdate('limit', parseInt(e.target.value))}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="space-y-4">
                        <Label className="text-xs uppercase tracking-widest opacity-50">Card 1 Styling</Label>
                        <div className="grid gap-2">
                            <Label htmlFor="card1BgColor">Background Color</Label>
                            <Input
                                id="card1BgColor"
                                type="text"
                                value={block.content.card1BgColor || ''}
                                onChange={(e) => handleUpdate('card1BgColor', e.target.value)}
                                placeholder="e.g. #f3f4f6 or var(--...)"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="card1Shadow">Drop Shadow</Label>
                            <Switch
                                id="card1Shadow"
                                checked={block.content.card1Shadow || false}
                                onCheckedChange={(checked) => handleUpdate('card1Shadow', checked)}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Label className="text-xs uppercase tracking-widest opacity-50">Card 5 Styling</Label>
                        <div className="grid gap-2">
                            <Label htmlFor="card5BgColor">Background Color</Label>
                            <Input
                                id="card5BgColor"
                                type="text"
                                value={block.content.card5BgColor || ''}
                                onChange={(e) => handleUpdate('card5BgColor', e.target.value)}
                                placeholder="e.g. #f3f4f6 or var(--...)"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="card5Shadow">Drop Shadow</Label>
                            <Switch
                                id="card5Shadow"
                                checked={block.content.card5Shadow || false}
                                onCheckedChange={(checked) => handleUpdate('card5Shadow', checked)}
                            />
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                <p>This layout uses a highly customized Bento grid for up to 6 podcasts.</p>
                <p>Podcasts are automatically fetched from your recent episodes API.</p>
            </div>
        </div>
    );
}
