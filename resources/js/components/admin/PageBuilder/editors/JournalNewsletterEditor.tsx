import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { JournalNewsletterBlock } from '@/types/page-blocks';

interface Props {
    content: JournalNewsletterBlock['content'];
    onUpdate: (updates: Partial<JournalNewsletterBlock['content']>) => void;
}

export default function JournalNewsletterEditor({ content, onUpdate }: Props) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>Title</Label>
                <Input 
                    value={content.title || ''} 
                    onChange={(e) => onUpdate({ title: e.target.value })} 
                    placeholder="e.g. Letters from the Edge"
                />
            </div>

            <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                    value={content.description || ''} 
                    onChange={(e) => onUpdate({ description: e.target.value })} 
                    placeholder="Describe the newsletter value proposition..."
                    rows={3}
                />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label>Input Placeholder</Label>
                    <Input 
                        value={content.placeholder || ''} 
                        onChange={(e) => onUpdate({ placeholder: e.target.value })} 
                        placeholder="Your destination email..."
                    />
                </div>
                <div className="space-y-2">
                    <Label>Button Text</Label>
                    <Input 
                        value={content.buttonText || ''} 
                        onChange={(e) => onUpdate({ buttonText: e.target.value })} 
                        placeholder="SUBSCRIBE"
                    />
                </div>
            </div>
        </div>
    );
}
