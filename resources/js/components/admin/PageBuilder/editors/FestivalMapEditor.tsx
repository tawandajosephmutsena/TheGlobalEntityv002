import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';
import type { FestivalMapBlock } from '@/types/page-blocks';

interface EditorProps {
    content: FestivalMapBlock['content'];
    onUpdate: (updates: Partial<FestivalMapBlock['content']>) => void;
}

const FestivalMapEditor: React.FC<EditorProps> = ({ content, onUpdate }) => {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>Block Title</Label>
                <Input
                    value={content.title || ''}
                    onChange={(e) => onUpdate({ title: e.target.value })}
                    placeholder="Explore the Magic"
                />
            </div>

            <div className="space-y-2">
                <Label>Subtitle</Label>
                <Input
                    value={content.subtitle || ''}
                    onChange={(e) => onUpdate({ subtitle: e.target.value })}
                    placeholder="Find festivals near you"
                />
            </div>

            <div className="space-y-2">
                <Label>Description (Optional)</Label>
                <Textarea
                    value={content.description || ''}
                    onChange={(e) => onUpdate({ description: e.target.value })}
                    placeholder="Add more details about the map..."
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Map Zoom</Label>
                    <Input
                        type="number"
                        value={content.zoom || 3}
                        onChange={(e) => onUpdate({ zoom: parseInt(e.target.value) })}
                        min={1}
                        max={20}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Map Theme</Label>
                    <Select
                        value={content.theme || 'fairy-pirate'}
                        onValueChange={(val: string) => onUpdate({ theme: val as FestivalMapBlock['content']['theme'] })}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="fairy-pirate">Fairy Pirate (Custom)</SelectItem>
                            <SelectItem value="light">Standard Light</SelectItem>
                            <SelectItem value="dark">Standard Dark</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                <div className="space-y-0.5">
                    <Label className="text-base">Show Search Bar</Label>
                    <p className="text-xs text-muted-foreground">
                        Allow users to search for specific locations
                    </p>
                </div>
                <Switch
                    checked={content.showSearch !== false}
                    onCheckedChange={(checked) => onUpdate({ showSearch: checked })}
                />
            </div>

            <div className="p-4 rounded-lg border border-accent/20 bg-accent/5 flex items-start gap-3">
                <Globe className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div className="space-y-1">
                    <p className="text-sm font-semibold text-accent">Map Intelligence</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        The map automatically clusters festivals. You can set the default starting center in the advanced settings.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FestivalMapEditor;
