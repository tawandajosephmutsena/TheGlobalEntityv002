import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { JournalHeroBlock } from '@/types/page-blocks';

interface Props {
    content: JournalHeroBlock['content'];
    onUpdate: (updates: Partial<JournalHeroBlock['content']>) => void;
}

export default function JournalHeroEditor({ content, onUpdate }: Props) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>Featured Post ID (Optional)</Label>
                <Input 
                    type="number"
                    value={content.featuredPostId || ''} 
                    onChange={(e) => onUpdate({ featuredPostId: e.target.value ? parseInt(e.target.value) : undefined })} 
                    placeholder="Leave blank for latest post"
                />
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Specify ID to pin a specific story, otherwise the most recent one is used.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label>Main Title Display</Label>
                    <Input 
                        value={content.titleMain || ''} 
                        onChange={(e) => onUpdate({ titleMain: e.target.value })} 
                        placeholder="Overwrites post title"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Highlight Word</Label>
                    <Input 
                        value={content.titleHighlight || ''} 
                        onChange={(e) => onUpdate({ titleHighlight: e.target.value })} 
                        placeholder="e.g. Future"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Description Override</Label>
                <Textarea 
                    value={content.description || ''} 
                    onChange={(e) => onUpdate({ description: e.target.value })} 
                    placeholder="Overwrites post excerpt"
                    rows={3}
                />
            </div>
        </div>
    );
}
