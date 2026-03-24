import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JournalArticleGridBlock } from '@/types/page-blocks';

interface Props {
    content: JournalArticleGridBlock['content'];
    onUpdate: (updates: Partial<JournalArticleGridBlock['content']>) => void;
}

export default function JournalArticleGridEditor({ content, onUpdate }: Props) {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label>Grid Columns</Label>
                    <Select 
                        value={String(content.columns || 3)} 
                        onValueChange={(val) => onUpdate({ columns: parseInt(val) as 2 | 3 })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select columns" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2">2 Columns</SelectItem>
                            <SelectItem value="3">3 Columns</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Posts per Page</Label>
                    <Input 
                        type="number"
                        value={content.limit || 9} 
                        onChange={(e) => onUpdate({ limit: parseInt(e.target.value) })} 
                    />
                </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg bg-surface-container-lowest">
                <div className="space-y-0.5">
                    <Label>Staggered Layout</Label>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Alternating vertical shifts for a dynamic feel.</p>
                </div>
                <Switch 
                    checked={content.staggered || false} 
                    onCheckedChange={(val) => onUpdate({ staggered: val })} 
                />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg bg-surface-container-lowest">
                <div className="space-y-0.5">
                    <Label>Show Bento Cards</Label>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Expand specific items into larger feature cards.</p>
                </div>
                <Switch 
                    checked={content.showBentoCards || false} 
                    onCheckedChange={(val) => onUpdate({ showBentoCards: val })} 
                />
            </div>
        </div>
    );
}
