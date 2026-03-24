import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from 'lucide-react';
import type { PartnersProcessBlock } from '@/types/page-blocks';

interface PartnersProcessEditorProps {
    content: PartnersProcessBlock['content'];
    onUpdate: (updates: Partial<PartnersProcessBlock['content']>) => void;
}

export default function PartnersProcessEditor({ content, onUpdate }: PartnersProcessEditorProps) {
    const updateStep = (index: number, updates: any) => {
        const newSteps = [...(content.steps || [])];
        newSteps[index] = { ...newSteps[index], ...updates };
        onUpdate({ steps: newSteps });
    };

    const addStep = () => {
        const newStep = {
            id: ((content.steps?.length || 0) + 1).toString(),
            title: 'New Step',
            description: 'Step description.',
            icon: ((content.steps?.length || 0) + 1).toString()
        };
        onUpdate({ steps: [...(content.steps || []), newStep] });
    };

    const removeStep = (index: number) => {
        const newSteps = [...(content.steps || [])].filter((_, i) => i !== index);
        // Re-calculate IDs for order
        const reorderedSteps = newSteps.map((s, i) => ({ ...s, id: (i + 1).toString(), icon: (i + 1).toString() }));
        onUpdate({ steps: reorderedSteps });
    };

    return (
        <div className="space-y-6 md:p-1">
            <div className="space-y-2">
                <Label>Section Title</Label>
                <Input 
                    value={content.title || ''} 
                    onChange={(e) => onUpdate({ title: e.target.value })} 
                />
            </div>

            <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                    <Label className="text-lg font-bold">Process Steps</Label>
                    <span className="text-xs text-muted-foreground">Recommended: Max 4 steps</span>
                </div>
                
                <div className="space-y-4">
                    {(content.steps || []).map((step, index) => (
                        <div key={index} className="p-4 border rounded-xl bg-background relative group">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                type="button"
                                className="absolute top-2 right-2 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeStep(index)}
                            >
                                <Trash2 size={16} />
                            </Button>

                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-agency-accent text-agency-secondary flex items-center justify-center font-black shrink-0">
                                    {step.id}
                                </div>
                                <div className="flex-1 space-y-3">
                                    <div className="space-y-1">
                                        <Label className="text-xs">Step Title</Label>
                                        <Input 
                                            value={step.title} 
                                            onChange={(e) => updateStep(index, { title: e.target.value })} 
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">Description</Label>
                                        <Textarea 
                                            value={step.description} 
                                            onChange={(e) => updateStep(index, { description: e.target.value })} 
                                            rows={2}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <Button 
                    variant="outline" 
                    type="button"
                    className="w-full" 
                    onClick={addStep}
                    disabled={(content.steps?.length || 0) >= 4}
                >
                    <Plus size={16} className="mr-2" /> Add Step
                </Button>
            </div>
        </div>
    );
}
