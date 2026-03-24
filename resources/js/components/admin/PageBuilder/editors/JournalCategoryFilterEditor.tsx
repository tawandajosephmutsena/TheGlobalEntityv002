import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { JournalCategoryFilterBlock } from '@/types/page-blocks';

interface Props {
    content: JournalCategoryFilterBlock['content'];
    onUpdate: (updates: Partial<JournalCategoryFilterBlock['content']>) => void;
}

export default function JournalCategoryFilterEditor({ content, onUpdate }: Props) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>All Categories Label</Label>
                <Input 
                    value={content.showAllLabel || ''} 
                    onChange={(e) => onUpdate({ showAllLabel: e.target.value })} 
                    placeholder="e.g. All Archives"
                />
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">The label for the "Reset Filter" button.</p>
            </div>
        </div>
    );
}
