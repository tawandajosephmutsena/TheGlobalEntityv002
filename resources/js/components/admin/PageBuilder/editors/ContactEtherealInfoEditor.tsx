"use client";

import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import MediaLibrary from "@/components/admin/MediaLibrary";
import { Plus, Trash2 } from 'lucide-react';
import type { ContactEtherealInfoBlock } from "@/types/page-blocks";

interface Props {
    content: ContactEtherealInfoBlock['content'];
    onUpdate: (updates: Partial<ContactEtherealInfoBlock['content']>) => void;
}

export default function ContactEtherealInfoEditor({ content, onUpdate }: Props) {
    const updateArchive = (updates: Partial<NonNullable<ContactEtherealInfoBlock['content']['archive']>>) => {
        onUpdate({ archive: { ...(content.archive || {}), ...updates } });
    };

    const updatePort = (updates: Partial<NonNullable<ContactEtherealInfoBlock['content']['directPort']>>) => {
        onUpdate({ directPort: { ...(content.directPort || {}), ...updates } });
    };

    const updateVoice = (updates: Partial<NonNullable<ContactEtherealInfoBlock['content']['voiceFrequency']>>) => {
        onUpdate({ voiceFrequency: { ...(content.voiceFrequency || {}), ...updates } });
    };

    const updateSocial = (updates: Partial<NonNullable<ContactEtherealInfoBlock['content']['socialTether']>>) => {
        onUpdate({ socialTether: { ...(content.socialTether || {}), ...updates } });
    };

    const addSocialLink = () => {
        const links = [...(content.socialTether?.links || [])];
        links.push({ label: "New Tether", url: "#" });
        updateSocial({ links });
    };

    const removeSocialLink = (index: number) => {
        const links = [...(content.socialTether?.links || [])];
        links.splice(index, 1);
        updateSocial({ links });
    };

    const updateSocialLink = (index: number, updates: Partial<{ label: string; url: string }>) => {
        const links = [...(content.socialTether?.links || [])];
        links[index] = { ...links[index], ...updates };
        updateSocial({ links });
    };

    return (
        <div className="space-y-12 p-4">
            {/* Archive Section */}
            <section className="space-y-6">
                <h3 className="text-lg font-bold border-b pb-2 flex items-center gap-2">
                    <span className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-sm">01</span>
                    Archive Card
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input 
                                value={content.archive?.title || ""} 
                                onChange={(e) => updateArchive({ title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea 
                                value={content.archive?.description || ""} 
                                onChange={(e) => updateArchive({ description: e.target.value })}
                                rows={3}
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Button Text</Label>
                            <Input 
                                value={content.archive?.buttonText || ""} 
                                onChange={(e) => updateArchive({ buttonText: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Button Link</Label>
                            <Input 
                                value={content.archive?.buttonLink || ""} 
                                onChange={(e) => updateArchive({ buttonLink: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Background Archive Image</Label>
                    <MediaLibrary 
                        currentValue={content.archive?.image || ""} 
                        onSelect={(asset) => updateArchive({ image: asset.url })}
                    />
                </div>
            </section>

            {/* Direct Port Section */}
            <section className="space-y-6">
                <h3 className="text-lg font-bold border-b pb-2 flex items-center gap-2">
                    <span className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-sm">02</span>
                    Direct Port Card
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label>Card Number</Label>
                        <Input 
                            value={content.directPort?.number || ""} 
                            onChange={(e) => updatePort({ number: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Input 
                            value={content.directPort?.title || ""} 
                            onChange={(e) => updatePort({ title: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Address / Description</Label>
                        <Input 
                            value={content.directPort?.description || ""} 
                            onChange={(e) => updatePort({ description: e.target.value })}
                        />
                    </div>
                </div>
            </section>

            {/* Instant Magic Section */}
            <section className="space-y-6">
                <h3 className="text-lg font-bold border-b pb-2 flex items-center gap-2">
                    <span className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-sm">03</span>
                    Instant Magic Card
                </h3>
                <div className="space-y-2">
                    <Label>Title</Label>
                    <Input 
                        value={content.instantMagic?.title || ""} 
                        onChange={(e) => onUpdate({ instantMagic: { title: e.target.value } })}
                    />
                </div>
            </section>

            {/* Voice Frequency Section */}
            <section className="space-y-6">
                <h3 className="text-lg font-bold border-b pb-2 flex items-center gap-2">
                    <span className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-sm">04</span>
                    Voice Frequency Card
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Input 
                            value={content.voiceFrequency?.title || ""} 
                            onChange={(e) => updateVoice({ title: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Input 
                            value={content.voiceFrequency?.description || ""} 
                            onChange={(e) => updateVoice({ description: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Phone Number</Label>
                        <Input 
                            value={content.voiceFrequency?.phone || ""} 
                            onChange={(e) => updateVoice({ phone: e.target.value })}
                        />
                    </div>
                </div>
            </section>

            {/* Social Tether Section */}
            <section className="space-y-6">
                <h3 className="text-lg font-bold border-b pb-2 flex items-center gap-2">
                    <span className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-sm">05</span>
                    Social Tether Card
                </h3>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Input 
                            value={content.socialTether?.title || ""} 
                            onChange={(e) => updateSocial({ title: e.target.value })}
                        />
                    </div>
                    <div className="space-y-4">
                        <Label>Social Links</Label>
                        <div className="space-y-3">
                            {(content.socialTether?.links || []).map((link, idx) => (
                                <div key={idx} className="flex gap-4 items-end bg-slate-50 p-4 rounded-lg relative group">
                                    <div className="flex-1 space-y-2">
                                        <Label className="text-xs">Label</Label>
                                        <Input 
                                            value={link.label} 
                                            onChange={(e) => updateSocialLink(idx, { label: e.target.value })}
                                            className="bg-white"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <Label className="text-xs">URL</Label>
                                        <Input 
                                            value={link.url} 
                                            onChange={(e) => updateSocialLink(idx, { url: e.target.value })}
                                            className="bg-white"
                                        />
                                    </div>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => removeSocialLink(idx)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button 
                                variant="outline" 
                                className="w-full border-dashed" 
                                onClick={addSocialLink}
                            >
                                <Plus className="h-4 w-4 mr-2" /> Add Social Tether
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
