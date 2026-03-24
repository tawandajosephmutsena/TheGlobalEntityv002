import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { FestivalProgressTrailBlock } from '@/types/page-blocks';

interface FestivalProgressTrailEditorProps {
    content: FestivalProgressTrailBlock['content'];
    onUpdate: (updates: Partial<FestivalProgressTrailBlock['content']>) => void;
}

export default function FestivalProgressTrailEditor({ content, onUpdate }: FestivalProgressTrailEditorProps) {
    const addStep = () => {
        const newStep = {
            id: Math.random().toString(36).substr(2, 9),
            label: 'NEW STEP',
            status: 'upcoming' as const
        };
        onUpdate({ steps: [...(content.steps || []), newStep] });
    };

    const updateStep = (id: string, updates: any) => {
        onUpdate({
            steps: content.steps?.map(s => s.id === id ? { ...s, ...updates } : s)
        });
    };

    const removeStep = (id: string) => {
        onUpdate({ steps: content.steps?.filter(s => s.id !== id) });
    };

    return (
        <div className="space-y-6 md:p-1">
            <div className="space-y-2">
                <Label>Main Text (Script style)</Label>
                <Input 
                    value={content.scriptText || ''} 
                    onChange={(e) => onUpdate({ scriptText: e.target.value })} 
                    placeholder="FOLLOW THE RHYTHM"
                />
            </div>

            <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                    <Label>Steps</Label>
                    <button 
                        onClick={addStep}
                        className="text-xs font-mono text-agency-accent hover:underline"
                        title="Add step"
                    >
                        + ADD STEP
                    </button>
                </div>
                
                <div className="space-y-4">
                    {content.steps?.map((step) => (
                        <div key={step.id} className="p-4 border border-agency-primary/10 bg-agency-primary/[0.02] space-y-3">
                            <div className="flex items-center gap-2">
                                <Input 
                                    value={step.label} 
                                    onChange={(e) => updateStep(step.id, { label: e.target.value })} 
                                    placeholder="Step Label"
                                    className="h-8 text-xs font-mono"
                                />
                                <button onClick={() => removeStep(step.id)} className="text-red-500" title="Remove step">×</button>
                            </div>
                            <select 
                                className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-xs ring-offset-background"
                                value={step.status}
                                onChange={(e) => updateStep(step.id, { status: e.target.value })}
                                title="Step status"
                            >
                                <option value="completed">Completed</option>
                                <option value="current">Current</option>
                                <option value="upcoming">Upcoming</option>
                            </select>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="space-y-2 pt-4 border-t">
                <Label>Path Type</Label>
                <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={content.pathType || 'wave'}
                    onChange={(e) => onUpdate({ pathType: e.target.value as any })}
                    title="Path type"
                >
                    <option value="wave">Wave (S-curve)</option>
                    <option value="loop">Loop (Curly)</option>
                    <option value="zigzag">Zigzag (Angular)</option>
                </select>
            </div>

            <div className="space-y-2">
                <Label>Path Color (CSS variable or hex)</Label>
                <Input 
                    value={content.color || ''} 
                    onChange={(e) => onUpdate({ color: e.target.value })} 
                    placeholder="var(--agency-accent)"
                />
            </div>
        </div>
    );
}
