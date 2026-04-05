"use client";

import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import MediaLibrary from "@/components/admin/MediaLibrary";
import type { ContactEtherealHeroBlock } from "@/types/page-blocks";

interface Props {
    content: ContactEtherealHeroBlock['content'];
    onUpdate: (updates: Partial<ContactEtherealHeroBlock['content']>) => void;
}

export default function ContactEtherealHeroEditor({ content, onUpdate }: Props) {
    const updateContent = (updates: Partial<ContactEtherealHeroBlock['content']>) => {
        onUpdate(updates);
    };

    const updateLabels = (updates: Partial<NonNullable<ContactEtherealHeroBlock['content']['labels']>>) => {
        onUpdate({
            labels: {
                ...(content.labels || {}),
                ...updates
            }
        });
    };

    const updatePlaceholders = (updates: Partial<NonNullable<ContactEtherealHeroBlock['content']['placeholders']>>) => {
        onUpdate({
            placeholders: {
                ...(content.placeholders || {}),
                ...updates
            }
        });
    };

    return (
        <div className="space-y-8 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Badge Text</Label>
                        <Input 
                            value={content.badgeText || ""} 
                            onChange={(e) => updateContent({ badgeText: e.target.value })}
                            placeholder="The Ethereal Portal"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Title Line 1</Label>
                        <Input 
                            value={content.titleLine1 || ""} 
                            onChange={(e) => updateContent({ titleLine1: e.target.value })}
                            placeholder="Cast Your Message"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Title Line 2 (Highlighted)</Label>
                        <Input 
                            value={content.titleLine2Highlight || ""} 
                            onChange={(e) => updateContent({ titleLine2Highlight: e.target.value })}
                            placeholder="into the Wind"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea 
                            value={content.description || ""} 
                            onChange={(e) => updateContent({ description: e.target.value })}
                            placeholder="Brief description..."
                            rows={4}
                        />
                    </div>
                </div>
            </div>

            <div className="border-t pt-6">
                <h3 className="text-lg font-bold mb-4 font-serif uppercase tracking-widest text-slate-800">Form Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="space-y-2 text-slate-700">
                            <Label className="font-bold">Labels</Label>
                            <div className="space-y-3 pl-4 border-l-2">
                                <div className="space-y-1">
                                    <Label className="text-xs uppercase">Name Label</Label>
                                    <Input 
                                        value={content.labels?.name || ""} 
                                        onChange={(e) => updateLabels({ name: e.target.value })}
                                        className="h-8"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs uppercase">Email Label</Label>
                                    <Input 
                                        value={content.labels?.email || ""} 
                                        onChange={(e) => updateLabels({ email: e.target.value })}
                                        className="h-8"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs uppercase">Message Label</Label>
                                    <Input 
                                        value={content.labels?.message || ""} 
                                        onChange={(e) => updateLabels({ message: e.target.value })}
                                        className="h-8"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Submit Button Text</Label>
                            <Input 
                                value={content.formSubmitText || ""} 
                                onChange={(e) => updateContent({ formSubmitText: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2 text-slate-700">
                            <Label className="font-bold">Placeholders</Label>
                            <div className="space-y-3 pl-4 border-l-2">
                                <div className="space-y-1">
                                    <Label className="text-xs uppercase">Name Placeholder</Label>
                                    <Input 
                                        value={content.placeholders?.name || ""} 
                                        onChange={(e) => updatePlaceholders({ name: e.target.value })}
                                        className="h-8"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs uppercase">Email Placeholder</Label>
                                    <Input 
                                        value={content.placeholders?.email || ""} 
                                        onChange={(e) => updatePlaceholders({ email: e.target.value })}
                                        className="h-8"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs uppercase">Message Placeholder</Label>
                                    <Input 
                                        value={content.placeholders?.message || ""} 
                                        onChange={(e) => updatePlaceholders({ message: e.target.value })}
                                        className="h-8"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>ETA Text (Subtitle)</Label>
                            <Input 
                                value={content.formEtaText || ""} 
                                onChange={(e) => updateContent({ formEtaText: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t pt-6">
                <Label className="block mb-4 font-bold">Side Frame Image</Label>
                <MediaLibrary 
                    currentValue={content.sideImage || ""} 
                    onSelect={(asset) => updateContent({ sideImage: asset.relative_url })}
                />
            </div>
        </div>
    );
}
