import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ImageIcon } from 'lucide-react';
import MediaLibrary from '@/components/admin/MediaLibrary';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { MediaAsset } from '@/types';
import { EcosystemContentBlock } from '@/types/page-blocks';
import { Textarea } from '@/components/ui/textarea';

interface Props {
    content: EcosystemContentBlock['content'];
    onUpdate: (updates: Partial<EcosystemContentBlock['content']>) => void;
}

const EcosystemContentBlockEditor = ({ content, onUpdate }: Props) => {
    const updateContent = (updates: Partial<EcosystemContentBlock['content']>) => {
        onUpdate({ ...content, ...updates });
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>Heading</Label>
                <Input
                    value={content.heading || ''}
                    onChange={(e) => updateContent({ heading: e.target.value })}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Dark Mode Image</Label>
                    <div className="flex gap-2">
                        <MediaLibrary
                            onSelect={(asset: MediaAsset) => updateContent({ imageDarkSrc: asset.url })}
                            trigger={
                                <Button size="sm" variant="outline" className="h-8 text-xs shrink-0">
                                    <ImageIcon className="h-3 w-3 mr-1" /> Choose
                                </Button>
                            }
                        />
                        <Input
                            className="h-8 text-xs flex-1"
                            value={content.imageDarkSrc || ''}
                            onChange={(e) => updateContent({ imageDarkSrc: e.target.value })}
                            placeholder="Image URL..."
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Light Mode Image</Label>
                    <div className="flex gap-2">
                        <MediaLibrary
                            onSelect={(asset: MediaAsset) => updateContent({ imageLightSrc: asset.url })}
                            trigger={
                                <Button size="sm" variant="outline" className="h-8 text-xs shrink-0">
                                    <ImageIcon className="h-3 w-3 mr-1" /> Choose
                                </Button>
                            }
                        />
                        <Input
                            className="h-8 text-xs flex-1"
                            value={content.imageLightSrc || ''}
                            onChange={(e) => updateContent({ imageLightSrc: e.target.value })}
                            placeholder="Image URL..."
                        />
                    </div>
                </div>
            </div>
            
            <div className="space-y-2">
                <Label>Image Alt Text</Label>
                <Input
                    value={content.imageAlt || ''}
                    onChange={(e) => updateContent({ imageAlt: e.target.value })}
                    placeholder="Description of the image content"
                />
            </div>

            <div className="space-y-2">
                <Label>Primary Description (Rich Text)</Label>
                <RichTextEditor
                    content={content.description1 || ''}
                    onChange={(html) => updateContent({ description1: html })}
                />
            </div>

            <div className="space-y-2">
                <Label>Secondary Description (Rich Text)</Label>
                <RichTextEditor
                    content={content.description2 || ''}
                    onChange={(html) => updateContent({ description2: html })}
                />
            </div>

            <div className="space-y-4 border p-4 rounded-lg bg-muted/50">
                <h4 className="font-medium text-sm">Quote Section</h4>
                <div className="space-y-2">
                    <Label>Quote Text</Label>
                    <Textarea
                        value={content.quoteText || ''}
                        onChange={(e) => updateContent({ quoteText: e.target.value })}
                        rows={3}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Quote Author</Label>
                    <Input
                        value={content.quoteAuthor || ''}
                        onChange={(e) => updateContent({ quoteAuthor: e.target.value })}
                    />
                </div>
            </div>
        </div>
    );
};

export default EcosystemContentBlockEditor;
