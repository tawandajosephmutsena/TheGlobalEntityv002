import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Type, Plus, Trash2, GripVertical, Settings2 } from 'lucide-react';

import type { GlassmorphismPricingBlock } from '@/types/page-blocks';

interface GlassmorphismPricingBlockEditorProps {
    block?: any;
    content: GlassmorphismPricingBlock['content'];
    onUpdate: (updates: Partial<GlassmorphismPricingBlock['content']>) => void;
}

export default function GlassmorphismPricingBlockEditor({ content, onUpdate }: GlassmorphismPricingBlockEditorProps) {
    const updateContent = (updates: Partial<GlassmorphismPricingBlock['content']>) => {
        onUpdate(updates);
    };

    const plans = content?.plans || [];

    const addPlan = () => {
        const newPlan = {
            name: 'New Plan',
            price: '$99',
            description: 'Description of the plan',
            features: ['Feature 1', 'Feature 2'],
            popular: false,
            buttonText: 'Get Started',
            buttonLink: '#'
        };
        updateContent({ plans: [...plans, newPlan] });
    };

    const updatePlan = (index: number, updates: Partial<NonNullable<GlassmorphismPricingBlock['content']['plans']>[0]>) => {
        const newPlans = [...plans];
        newPlans[index] = { ...newPlans[index], ...updates };
        updateContent({ plans: newPlans });
    };

    const removePlan = (index: number) => {
        const newPlans = plans.filter((_, i: number) => i !== index);
        updateContent({ plans: newPlans });
    };

    return (
        <div className="space-y-8">
            <div className="space-y-4 border-b pb-6">
                <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                        <Type className="h-4 w-4" />
                        Main Title
                    </Label>
                    <Input
                        value={String(content.title || '')}
                        onChange={(e) => updateContent({ title: e.target.value })}
                        placeholder="e.g. Simple, transparent pricing"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                        <Type className="h-4 w-4" />
                        Subtitle
                    </Label>
                    <Input
                        value={String(content.subtitle || '')}
                        onChange={(e) => updateContent({ subtitle: e.target.value })}
                        placeholder="e.g. Choose the plan that's right for your team"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2 text-base font-semibold">
                        <Settings2 className="h-4 w-4" />
                        Pricing Plans
                    </Label>
                    <Button onClick={addPlan} size="sm" variant="outline" className="gap-2">
                        <Plus className="h-4 w-4" /> Add Plan
                    </Button>
                </div>

                <div className="space-y-4">
                    {plans.map((plan, index: number) => (
                        <div key={index} className="relative rounded-lg border bg-card p-4 shadow-sm transition-all focus-within:ring-2 focus-within:ring-ring">
                            <div className="absolute right-4 top-4 flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive opacity-50 hover:opacity-100"
                                    onClick={() => removePlan(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground cursor-move">
                                <GripVertical className="h-4 w-4" />
                                Plan {index + 1}
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Name</Label>
                                    <Input
                                        value={plan.name || ''}
                                        onChange={(e) => updatePlan(index, { name: e.target.value })}
                                        placeholder="e.g. Pro"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Price</Label>
                                    <Input
                                        value={plan.price || ''}
                                        onChange={(e) => updatePlan(index, { price: e.target.value })}
                                        placeholder="e.g. $99 or Custom"
                                    />
                                </div>
                                <div className="space-y-2 sm:col-span-2">
                                    <Label>Description</Label>
                                    <Input
                                        value={plan.description || ''}
                                        onChange={(e) => updatePlan(index, { description: e.target.value })}
                                        placeholder="e.g. For growing businesses"
                                    />
                                </div>
                                
                                <div className="space-y-2 sm:col-span-2">
                                    <Label>Features (One per line)</Label>
                                    <Textarea
                                        value={(plan.features || []).join('\n')}
                                        onChange={(e) => updatePlan(index, { features: e.target.value.split('\n').filter((f: string) => f.trim() !== '') })}
                                        placeholder="Unlimited users&#10;Advanced analytics&#10;Priority support"
                                        rows={4}
                                    />
                                </div>

                                <div className="space-y-2 sm:col-span-2 flex items-center justify-between rounded-lg border p-3">
                                    <div className="space-y-0.5">
                                        <Label>Most Popular</Label>
                                        <div className="text-sm text-muted-foreground">Highlight this plan as the recommended option.</div>
                                    </div>
                                    <Switch
                                        checked={plan.popular || false}
                                        onCheckedChange={(checked) => updatePlan(index, { popular: checked })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Button Text</Label>
                                    <Input
                                        value={plan.buttonText || ''}
                                        onChange={(e) => updatePlan(index, { buttonText: e.target.value })}
                                        placeholder="e.g. Get Started"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Button Link</Label>
                                    <Input
                                        value={plan.buttonLink || ''}
                                        onChange={(e) => updatePlan(index, { buttonLink: e.target.value })}
                                        placeholder="e.g. /contact"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    {plans.length === 0 && (
                        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                            No plans added yet. Click &quot;Add Plan&quot; to create one.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
