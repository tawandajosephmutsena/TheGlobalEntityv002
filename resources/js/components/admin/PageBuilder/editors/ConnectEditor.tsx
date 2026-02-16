import React from 'react';
import { ConnectBlock } from '@/types/page-blocks';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface ConnectEditorProps {
    content: ConnectBlock['content'];
    onUpdate: (updates: Partial<ConnectBlock['content']>) => void;
}

export default function ConnectEditor({ content, onUpdate }: ConnectEditorProps) {
    const labels = content.labels || [];

    const handleLabelChange = (index: number, value: string) => {
        const newLabels = [...labels];
        newLabels[index] = value;
        onUpdate({ labels: newLabels });
    };

    const addLabel = () => {
        onUpdate({ labels: [...labels, 'New Label'] });
    };

    const removeLabel = (index: number) => {
        onUpdate({ labels: labels.filter((_, i) => i !== index) });
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>Title</Label>
                <Input
                    value={content.title || ''}
                    onChange={(e) => onUpdate({ title: e.target.value })}
                    placeholder="Any questions about Design?"
                />
            </div>

            <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                    value={content.description || ''}
                    onChange={(e) => onUpdate({ description: e.target.value })}
                    placeholder="Feel free to reach out to me!"
                />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label>Floating Labels (Max 4 recommended)</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addLabel}>
                        <Plus className="h-4 w-4 mr-1" /> Add Label
                    </Button>
                </div>
                <div className="grid grid-cols-1 gap-2">
                    {labels.map((label, index) => (
                        <div key={index} className="flex gap-2">
                            <Input
                                value={label}
                                onChange={(e) => handleLabelChange(index, e.target.value)}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeLabel(index)}
                                className="text-destructive"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <Label>Pointer / Name Label</Label>
                <Input
                    value={content.pointerLabel || ''}
                    onChange={(e) => onUpdate({ pointerLabel: e.target.value })}
                    placeholder="Ali"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>CTA Text</Label>
                    <Input
                        value={content.ctaText || ''}
                        onChange={(e) => onUpdate({ ctaText: e.target.value })}
                        placeholder="Book a call"
                    />
                </div>
                <div className="space-y-2">
                    <Label>CTA Link (Href)</Label>
                    <Input
                        value={content.ctaHref || ''}
                        onChange={(e) => onUpdate({ ctaHref: e.target.value })}
                        placeholder="https://..."
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input
                        value={content.email || ''}
                        onChange={(e) => onUpdate({ email: e.target.value })}
                        placeholder="contact@example.com"
                    />
                </div>
                <div className="space-y-2">
                    <Label>WhatsApp Number</Label>
                    <Input
                        value={content.whatsapp || ''}
                        onChange={(e) => onUpdate({ whatsapp: e.target.value })}
                        placeholder="91767..."
                    />
                </div>
            </div>
        </div>
    );
}
