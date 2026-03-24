import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, LayoutGrid, FileText, Settings, Type } from 'lucide-react';
import type { ContactCartographerBlock } from '@/types/page-blocks';

interface Props {
    content: ContactCartographerBlock['content'];
    onUpdate: (updates: Partial<ContactCartographerBlock['content']>) => void;
}

export default function ContactCartographerEditor({ content, onUpdate }: Props) {
    const updateContent = (updates: Partial<ContactCartographerBlock['content']>) => {
        onUpdate({ ...content, ...updates });
    };

    const addCard = () => {
        const newCards = [
            ...(content.inquiryCards || []),
            {
                id: Math.random().toString(36).substr(2, 9),
                icon: 'explore',
                title: 'New Inquiry',
                description: 'Description of this inquiry area...',
                color: 'primary' as const
            }
        ];
        updateContent({ inquiryCards: newCards });
    };

    const updateCard = (id: string, updates: Partial<NonNullable<ContactCartographerBlock['content']['inquiryCards']>[number]>) => {
        const newCards = (content.inquiryCards || []).map(card => 
            card.id === id ? { ...card, ...updates } : card
        );
        updateContent({ inquiryCards: newCards });
    };

    const removeCard = (id: string) => {
        const newCards = (content.inquiryCards || []).filter(card => card.id !== id);
        updateContent({ inquiryCards: newCards });
    };

    const handleSubjectsChange = (value: string) => {
        const subjects = value.split(',').map(s => s.trim()).filter(Boolean);
        updateContent({ subjects });
    };

    return (
        <div className="space-y-10 p-2">
            
            {/* Hero Section */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                    <Type className="size-5" />
                    <h3 className="text-lg font-bold uppercase tracking-wider">Hero Content</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Input 
                            value={content.heroTitle || ""} 
                            onChange={(e) => updateContent({ heroTitle: e.target.value })}
                            placeholder="Say Hello"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Title Highlight</Label>
                        <Input 
                            value={content.heroTitleHighlight || ""} 
                            onChange={(e) => updateContent({ heroTitleHighlight: e.target.value })}
                            placeholder="."
                        />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Hero Description</Label>
                        <Textarea 
                            value={content.heroDescription || ""} 
                            onChange={(e) => updateContent({ heroDescription: e.target.value })}
                            placeholder="Welcome message..."
                            rows={3}
                        />
                    </div>
                </div>
            </section>

            {/* Inquiries Bento Cards */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-primary">
                        <LayoutGrid className="size-5" />
                        <h3 className="text-lg font-bold uppercase tracking-wider">Inquiry Cards</h3>
                    </div>
                    <Button onClick={addCard} size="sm" variant="outline" className="rounded-full">
                        <Plus className="size-4 mr-2" /> Add Card
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {(content.inquiryCards || []).map((card) => (
                        <Card key={card.id} className="relative group border-muted shadow-none bg-muted/20">
                            <Button 
                                variant="destructive" 
                                size="icon" 
                                className="absolute top-2 right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"
                                onClick={() => removeCard(card.id)}
                            >
                                <Trash2 className="size-3.5" />
                            </Button>
                            <CardContent className="p-4 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Icon</Label>
                                        <Select value={card.icon} onValueChange={(val) => updateCard(card.id, { icon: val })}>
                                            <SelectTrigger className="h-9 bg-background">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="explore">Explore / Map</SelectItem>
                                                <SelectItem value="groups">Community / Users</SelectItem>
                                                <SelectItem value="handshake">Partnerships / Handshake</SelectItem>
                                                <SelectItem value="newspaper">Press / News</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Color Theme</Label>
                                        <Select value={card.color} onValueChange={(val: any) => updateCard(card.id, { color: val })}>
                                            <SelectTrigger className="h-9 bg-background">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="primary">Primary</SelectItem>
                                                <SelectItem value="secondary">Secondary</SelectItem>
                                                <SelectItem value="tertiary">Tertiary</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Title</Label>
                                        <Input 
                                            value={card.title} 
                                            onChange={(e) => updateCard(card.id, { title: e.target.value })}
                                            className="h-9 bg-background"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Description</Label>
                                    <Textarea 
                                        value={card.description} 
                                        onChange={(e) => updateCard(card.id, { description: e.target.value })}
                                        className="text-xs bg-background"
                                        rows={2}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {(content.inquiryCards || []).length === 0 && (
                        <div className="text-center p-8 border-2 border-dashed rounded-2xl text-muted-foreground italic">
                            No cards added yet. Click "Add Card" to begin.
                        </div>
                    )}
                </div>
            </section>

            {/* Form Configuration */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                    <FileText className="size-5" />
                    <h3 className="text-lg font-bold uppercase tracking-wider">Form Configuration</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Form Area Title</Label>
                        <Input 
                            value={content.formTitle || ""} 
                            onChange={(e) => updateContent({ formTitle: e.target.value })}
                            placeholder="Send a Message"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Form Area Description</Label>
                        <Input 
                            value={content.formDescription || ""} 
                            onChange={(e) => updateContent({ formDescription: e.target.value })}
                            placeholder="Fill out the fields..."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Submit Button Text</Label>
                        <Input 
                            value={content.formSubmitText || ""} 
                            onChange={(e) => updateContent({ formSubmitText: e.target.value })}
                            placeholder="Dispatch Message"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Success Message</Label>
                        <Input 
                            value={content.formSuccessMessage || ""} 
                            onChange={(e) => updateContent({ formSuccessMessage: e.target.value })}
                            placeholder="Success!"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Admin Notification Email (Optional)</Label>
                        <Input 
                            value={content.formAdminEmail || ""} 
                            onChange={(e) => updateContent({ formAdminEmail: e.target.value })}
                            placeholder="admin@example.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Dropdown Subjects (Comma separated)</Label>
                        <Input 
                            value={(content.subjects || []).join(', ')} 
                            onChange={(e) => handleSubjectsChange(e.target.value)}
                            placeholder="General, Support, Media"
                        />
                    </div>
                </div>
            </section>

        </div>
    );
}
