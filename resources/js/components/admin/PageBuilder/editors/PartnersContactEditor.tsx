import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash, Trash2, GripVertical, Settings2, Sparkles, Mail } from 'lucide-react';
import type { PartnersContactBlock } from '@/types/page-blocks';
import { FormField, FormStep } from '@/components/ui/OnboardingForm';
import RichTextEditor from '@/components/admin/RichTextEditor';

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

    const updateSteps = (newSteps: FormStep[]) => {
        onUpdate({ steps: newSteps });
    };

    return (
        <div className="space-y-8 md:p-1">
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-agency-accent">
                    <Sparkles size={20} />
                    <h3 className="text-lg font-bold">Hero Content (Left Side)</h3>
                </div>
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
                    <Label className="text-sm font-bold uppercase tracking-wider opacity-60">Featured Benefits</Label>
                    <div className="space-y-2">
                        {(content.features || []).map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 group">
                                <GripVertical className="h-4 w-4 text-muted-foreground shrink-0 cursor-grab" />
                                <Input 
                                    className="h-9"
                                    value={feature} 
                                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                                />
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    type="button"
                                    onClick={() => removeFeature(index)}
                                    className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        ))}
                    </div>
                    <Button variant="outline" size="sm" type="button" className="w-full h-9 border-dashed" onClick={addFeature}>
                        <Plus size={14} className="mr-2" /> Add Benefit
                    </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 pt-4 border-t">
                    <div className="space-y-2">
                        <Label>Response Label</Label>
                        <Input 
                            className="h-9"
                            value={content.averageResponseLabel || ''} 
                            onChange={(e) => onUpdate({ averageResponseLabel: e.target.value })} 
                            placeholder="Average Response"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Response Time</Label>
                        <Input 
                            className="h-9"
                            value={content.averageResponseValue || ''} 
                            onChange={(e) => onUpdate({ averageResponseValue: e.target.value })} 
                            placeholder="24-48 Moons"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-6 pt-8 border-t-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-agency-accent">
                        <Mail size={20} />
                        <h3 className="text-lg font-bold">Dynamic Multi-Step Form</h3>
                    </div>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8"
                        onClick={() => {
                            const steps = (content.steps || []) as FormStep[];
                            updateSteps([...steps, { 
                                id: Math.random().toString(36).substr(2, 9), 
                                title: 'New Step', 
                                fields: [] 
                            }]);
                        }}
                    >
                        <Plus className="h-3 w-3 mr-1" /> Add Step
                    </Button>
                </div>

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

                <div className="space-y-6">
                    {((content.steps || []) as FormStep[]).map((step, stepIdx) => (
                        <div key={step.id || stepIdx} className="p-4 border rounded-2xl bg-muted/5 space-y-4 relative group/step border-agency-accent/10">
                            <button 
                                type="button" 
                                title="Remove Step"
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover/step:opacity-100 transition-opacity z-10"
                                onClick={() => {
                                    const steps = [...((content.steps || []) as FormStep[])];
                                    steps.splice(stepIdx, 1);
                                    updateSteps(steps);
                                }}
                            >
                                <Trash className="h-3 w-3" />
                            </button>
                            
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-bold uppercase opacity-50">Step Title</Label>
                                    <Input 
                                        className="h-8 text-xs font-bold" 
                                        value={step.title} 
                                        onChange={(e) => {
                                            const steps = [...((content.steps || []) as FormStep[])];
                                            steps[stepIdx] = { ...step, title: e.target.value };
                                            updateSteps(steps);
                                        }}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-bold uppercase opacity-50">Step Description</Label>
                                    <Input 
                                        className="h-8 text-[11px]" 
                                        value={step.description || ''} 
                                        onChange={(e) => {
                                            const steps = [...((content.steps || []) as FormStep[])];
                                            steps[stepIdx] = { ...step, description: e.target.value };
                                            updateSteps(steps);
                                        }}
                                        placeholder="Short description for this step..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-3 pt-3 border-t border-agency-accent/5">
                                <div className="flex items-center justify-between">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Fields</Label>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-6 text-[10px]"
                                        onClick={() => {
                                            const steps = [...((content.steps || []) as FormStep[])];
                                            const fields = [...(step.fields || [])];
                                            fields.push({ 
                                                label: 'New Field', 
                                                type: 'text', 
                                                name: 'field_' + Math.random().toString(36).substr(2, 5),
                                                required: false
                                            });
                                            steps[stepIdx] = { ...step, fields };
                                            updateSteps(steps);
                                        }}
                                    >
                                        <Plus className="h-3 w-3 mr-1" /> Add Field
                                    </Button>
                                </div>
                                
                                <div className="space-y-3">
                                    {(step.fields || []).map((field, fieldIdx) => (
                                        <div key={fieldIdx} className="p-3 border rounded-xl bg-background/50 space-y-3 relative group/field shadow-sm">
                                            <button 
                                                type="button" 
                                                title="Remove Field"
                                                className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover/field:opacity-100 transition-opacity"
                                                onClick={() => {
                                                    const steps = [...((content.steps || []) as FormStep[])];
                                                    const fields = [...(step.fields || [])];
                                                    fields.splice(fieldIdx, 1);
                                                    steps[stepIdx] = { ...step, fields };
                                                    updateSteps(steps);
                                                }}
                                            >
                                                <Trash className="h-3 w-3" />
                                            </button>

                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="space-y-1">
                                                    <Label className="text-[9px] uppercase font-bold opacity-50">Label</Label>
                                                    <Input 
                                                        className="h-7 text-xs" 
                                                        value={field.label} 
                                                        onChange={(e) => {
                                                            const steps = [...((content.steps || []) as FormStep[])];
                                                            const fields = [...step.fields];
                                                            fields[fieldIdx] = { ...field, label: e.target.value };
                                                            steps[stepIdx] = { ...step, fields };
                                                            updateSteps(steps);
                                                        }}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-[9px] uppercase font-bold opacity-50">Field Type</Label>
                                                    <Select 
                                                        value={field.type} 
                                                        onValueChange={(val: FormField['type']) => {
                                                            const steps = [...((content.steps || []) as FormStep[])];
                                                            const fields = [...step.fields];
                                                            fields[fieldIdx] = { ...field, type: val };
                                                            if (['select', 'radio', 'checkbox'].includes(val) && !field.options) {
                                                                fields[fieldIdx].options = ['Option 1'];
                                                            }
                                                            steps[stepIdx] = { ...step, fields };
                                                            updateSteps(steps);
                                                        }}
                                                    >
                                                        <SelectTrigger className="h-7 text-xs">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="text">Text</SelectItem>
                                                            <SelectItem value="email">Email</SelectItem>
                                                            <SelectItem value="number">Number</SelectItem>
                                                            <SelectItem value="tel">Phone</SelectItem>
                                                            <SelectItem value="textarea">Long Text</SelectItem>
                                                            <SelectItem value="select">Dropdown</SelectItem>
                                                            <SelectItem value="radio">Radio Buttons</SelectItem>
                                                            <SelectItem value="checkbox">Checkboxes</SelectItem>
                                                            <SelectItem value="file">File Upload</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="space-y-1">
                                                    <Label className="text-[9px] uppercase font-bold opacity-50">Field Name (ID)</Label>
                                                    <Input 
                                                        className="h-7 text-[10px] font-mono" 
                                                        value={field.name} 
                                                        onChange={(e) => {
                                                            const steps = [...((content.steps || []) as FormStep[])];
                                                            const fields = [...step.fields];
                                                            fields[fieldIdx] = { ...field, name: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_') };
                                                            steps[stepIdx] = { ...step, fields };
                                                            updateSteps(steps);
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2 pt-4">
                                                    <Switch 
                                                        checked={!!field.required}
                                                        onCheckedChange={(checked) => {
                                                            const steps = [...((content.steps || []) as FormStep[])];
                                                            const fields = [...step.fields];
                                                            fields[fieldIdx] = { ...field, required: checked };
                                                            steps[stepIdx] = { ...step, fields };
                                                            updateSteps(steps);
                                                        }}
                                                    />
                                                    <Label className="text-[10px] cursor-pointer">Required</Label>
                                                </div>
                                            </div>

                                            {['select', 'radio', 'checkbox'].includes(field.type) && (
                                                <div className="space-y-2 pt-2 border-t border-dashed">
                                                    <div className="flex items-center justify-between">
                                                        <Label className="text-[9px] uppercase font-bold text-muted-foreground">Options</Label>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            className="h-5 text-[8px]"
                                                            onClick={() => {
                                                                const steps = [...((content.steps || []) as FormStep[])];
                                                                const fields = [...step.fields];
                                                                const options = [...(field.options || [])];
                                                                options.push(`Option ${options.length + 1}`);
                                                                fields[fieldIdx] = { ...field, options };
                                                                steps[stepIdx] = { ...step, fields };
                                                                updateSteps(steps);
                                                            }}
                                                        >
                                                            <Plus className="h-2 w-2 mr-1" /> Add Option
                                                        </Button>
                                                    </div>
                                                    <div className="space-y-1">
                                                        {(field.options || []).map((opt, optIdx) => (
                                                            <div key={optIdx} className="flex gap-1 group/opt">
                                                                <Input 
                                                                    className="h-6 text-[10px]" 
                                                                    value={opt} 
                                                                    onChange={(e) => {
                                                                        const steps = [...((content.steps || []) as FormStep[])];
                                                                        const fields = [...step.fields];
                                                                        const options = [...(field.options || [])];
                                                                        options[optIdx] = e.target.value;
                                                                        fields[fieldIdx] = { ...field, options };
                                                                        steps[stepIdx] = { ...step, fields };
                                                                        updateSteps(steps);
                                                                    }}
                                                                />
                                                                <Button 
                                                                    variant="ghost" 
                                                                    size="icon" 
                                                                    className="h-6 w-6 opacity-0 group-hover/opt:opacity-100"
                                                                    onClick={() => {
                                                                        const steps = [...((content.steps || []) as FormStep[])];
                                                                        const fields = [...step.fields];
                                                                        const options = [...(field.options || [])];
                                                                        options.splice(optIdx, 1);
                                                                        fields[fieldIdx] = { ...field, options };
                                                                        steps[stepIdx] = { ...step, fields };
                                                                        updateSteps(steps);
                                                                    }}
                                                                >
                                                                    <Trash className="h-2 w-2" />
                                                                </Button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-6 pt-8 border-t-2">
                <div className="flex items-center gap-2 text-agency-accent">
                    <Settings2 size={20} />
                    <h3 className="text-lg font-bold">Success & Notification Settings</h3>
                </div>
                
                <div className="space-y-2">
                    <Label>Success Message</Label>
                    <Input 
                        value={content.successMessage || ''} 
                        onChange={(e) => onUpdate({ successMessage: e.target.value })} 
                        placeholder="Thank you! Your message has been sent."
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label>Admin Notification Email</Label>
                        <Input 
                            value={content.adminEmail || ''} 
                            onChange={(e) => onUpdate({ adminEmail: e.target.value })} 
                            placeholder="admin@example.com (Optional)"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Reply-To Email</Label>
                        <Input 
                            value={content.replyToEmail || ''} 
                            onChange={(e) => onUpdate({ replyToEmail: e.target.value })} 
                            placeholder="noreply@example.com (Optional)"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Confirmation Email Body (Sent to User)</Label>
                    <div className="min-h-[200px] border rounded-xl overflow-hidden">
                        <RichTextEditor
                            content={content.confirmationEmailBody || ''}
                            onChange={(content) => onUpdate({ confirmationEmailBody: content })}
                            placeholder="Custom message for the confirmation email..."
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                    <Switch 
                        checked={content.allowMultipleSubmissions !== false} 
                        onCheckedChange={(checked) => onUpdate({ allowMultipleSubmissions: checked })}
                    />
                    <Label className="text-sm cursor-pointer font-bold opacity-70">Allow Multiple Submissions</Label>
                </div>
            </div>
        </div>
    );
}

