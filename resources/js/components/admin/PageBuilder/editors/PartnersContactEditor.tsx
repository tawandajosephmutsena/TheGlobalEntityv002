import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical } from 'lucide-react';
import type { PartnersContactBlock } from '@/types/page-blocks';

interface PartnersContactEditorProps {
    content: PartnersContactBlock['content'];
    onUpdate: (updates: Partial<PartnersContactBlock['content']>) => void;
}

export default function PartnersContactEditor({ content, onUpdate }: PartnersContactEditorProps) {
    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...(content.features || [])];
        newFeatures[index] = value;
        onUpdate({ features: newFeatures });
    };

    const addFeature = () => {
        onUpdate({ features: [...(content.features || []), 'New Benefit'] });
    };

    const removeFeature = (index: number) => {
        onUpdate({ features: (content.features || []).filter((_, i) => i !== index) });
    };

    return (
        <div className="space-y-6 md:p-1">
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label>Main Title</Label>
                    <Input 
                        value={content.title || ''} 
                        onChange={(e) => onUpdate({ title: e.target.value })} 
                    />
                </div>
                <div className="space-y-2">
                    <Label>Subtitle</Label>
                    <Input 
                        value={content.subtitle || ''} 
                        onChange={(e) => onUpdate({ subtitle: e.target.value })} 
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                    value={content.description || ''} 
                    onChange={(e) => onUpdate({ description: e.target.value })} 
                    rows={3}
                />
            </div>

            <div className="space-y-4 pt-4 border-t">
                <Label className="text-lg font-bold">Featured Benefits</Label>
                <div className="space-y-2">
                    {(content.features || []).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                            <Input 
                                value={feature} 
                                onChange={(e) => handleFeatureChange(index, e.target.value)}
                            />
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                type="button"
                                onClick={() => removeFeature(index)}
                                className="text-destructive shrink-0"
                            >
                                <Trash2 size={16} />
                            </Button>
                        </div>
                    ))}
                </div>
                <Button variant="outline" type="button" className="w-full" onClick={addFeature}>
                    <Plus size={16} className="mr-2" /> Add Benefit
                </Button>
            </div>

            <div className="space-y-4 pt-4 border-t">
                <Label className="text-lg font-bold text-agency-accent">Form Details</Label>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label>Form Title</Label>
                        <Input 
                            value={content.formTitle || ''} 
                            onChange={(e) => onUpdate({ formTitle: e.target.value })} 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Submit Button Text</Label>
                        <Input 
                            value={content.submitText || ''} 
                            onChange={(e) => onUpdate({ submitText: e.target.value })} 
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Form Description</Label>
                    <Textarea 
                        value={content.formDescription || ''} 
                        onChange={(e) => onUpdate({ formDescription: e.target.value })} 
                        rows={2}
                    />
                </div>
            </div>
        </div>
    );
}
