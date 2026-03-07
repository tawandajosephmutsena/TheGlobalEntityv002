import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { FaqSectionBlock } from '@/types/page-blocks';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { Textarea } from '@/components/ui/textarea';

interface Props {
    content: FaqSectionBlock['content'];
    onUpdate: (updates: Partial<FaqSectionBlock['content']>) => void;
}

const FaqSectionBlockEditor = ({ content, onUpdate }: Props) => {
    const updateContent = (updates: Partial<FaqSectionBlock['content']>) => {
        onUpdate({ ...content, ...updates });
    };

    const addFaq = () => {
        const faqs = content.faqs || [];
        updateContent({ 
            faqs: [
                ...faqs, 
                { id: `item-${Date.now()}`, icon: 'help-circle', question: 'New Question?', answer: 'New Answer' }
            ] 
        });
    };

    const updateFaq = (index: number, key: keyof FaqSectionBlock['content']['faqs'][0], value: string) => {
        const faqs = [...(content.faqs || [])];
        faqs[index] = { ...faqs[index], [key]: value };
        updateContent({ faqs });
    };

    const removeFaq = (index: number) => {
        const faqs = [...(content.faqs || [])];
        faqs.splice(index, 1);
        updateContent({ faqs });
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>Section Heading</Label>
                <Input
                    value={content.heading || ''}
                    onChange={(e) => updateContent({ heading: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <Label>Sidebar Description (Rich Text, include links here)</Label>
                <RichTextEditor
                    content={content.description || ''}
                    onChange={(html) => updateContent({ description: html })}
                />
            </div>

            <div className="space-y-4 border p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between">
                    <Label>FAQ Items</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addFaq}>
                        <Plus className="h-4 w-4 mr-1" /> Add FAQ
                    </Button>
                </div>
                
                <div className="space-y-4">
                    {(content.faqs || []).map((faq, index) => (
                        <div key={faq.id || index} className="space-y-3 p-4 bg-background border rounded-lg relative">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFaq(index)}
                                className="absolute right-2 top-2 h-8 w-8 text-destructive"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            
                            <div className="pr-10 grid gap-4 grid-cols-1 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Question</Label>
                                    <Input
                                        value={faq.question}
                                        onChange={(e) => updateFaq(index, 'question', e.target.value)}
                                        placeholder="E.g., What are your hours?"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Lucide Icon Name</Label>
                                    <Input
                                        value={faq.icon}
                                        onChange={(e) => updateFaq(index, 'icon', e.target.value)}
                                        placeholder="E.g., clock, credit-card (lowercase)"
                                    />
                                    <p className="text-[10px] text-muted-foreground mt-1">Must be a valid Lucide React icon name.</p>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Answer</Label>
                                    <Textarea
                                        value={faq.answer}
                                        onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FaqSectionBlockEditor;
