import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, ImageIcon } from 'lucide-react';
import { AiFeaturesBlock } from '@/types/page-blocks';
import { Textarea } from '@/components/ui/textarea';
import MediaLibrary from '@/components/admin/MediaLibrary';
import { MediaAsset } from '@/types';

interface Props {
    content: AiFeaturesBlock['content'];
    onUpdate: (updates: Partial<AiFeaturesBlock['content']>) => void;
}

const AiFeaturesBlockEditor = ({ content, onUpdate }: Props) => {
    const updateContent = (updates: Partial<AiFeaturesBlock['content']>) => {
        onUpdate({ ...content, ...updates });
    };

    const addFeature = () => {
        const features = content.features || [];
        updateContent({ 
            features: [
                ...features, 
                { 
                    id: `item-${Date.now()}`, 
                    icon: 'database', 
                    title: 'New Feature', 
                    description: 'Feature description',
                    imageSrc: ''
                }
            ] 
        });
    };

    const updateFeature = (index: number, key: keyof NonNullable<AiFeaturesBlock['content']['features']>[0], value: string) => {
        const features = [...(content.features || [])];
        features[index] = { ...features[index], [key]: value };
        updateContent({ features });
    };

    const removeFeature = (index: number) => {
        const features = [...(content.features || [])];
        features.splice(index, 1);
        updateContent({ features });
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
                <Label>Top Description</Label>
                <Textarea
                    value={content.description || ''}
                    onChange={(e) => updateContent({ description: e.target.value })}
                    rows={2}
                />
            </div>

            <div className="space-y-4 border p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between">
                    <Label>Features List</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                        <Plus className="h-4 w-4 mr-1" /> Add Feature
                    </Button>
                </div>
                
                <div className="space-y-4">
                    {(content.features || []).map((feature, index) => (
                        <div key={feature.id || index} className="space-y-4 p-4 bg-background border rounded-lg relative">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFeature(index)}
                                className="absolute right-2 top-2 h-8 w-8 text-destructive"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            
                            <div className="pr-10 grid gap-4 grid-cols-1 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Title</Label>
                                    <Input
                                        value={feature.title}
                                        onChange={(e) => updateFeature(index, 'title', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Lucide Icon Name</Label>
                                    <Input
                                        value={feature.icon}
                                        onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                                        placeholder="E.g., database, fingerprint"
                                    />
                                    <p className="text-[10px] text-muted-foreground mt-1">Lowercase valid Lucide name.</p>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Description</Label>
                                    <Textarea
                                        value={feature.description}
                                        onChange={(e) => updateFeature(index, 'description', e.target.value)}
                                        rows={2}
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Feature Image</Label>
                                    <div className="flex gap-2">
                                        <MediaLibrary
                                            onSelect={(asset: MediaAsset) => updateFeature(index, 'imageSrc', asset.relative_url)}
                                            trigger={
                                                <Button size="sm" variant="outline" className="h-8 text-xs shrink-0">
                                                    <ImageIcon className="h-3 w-3 mr-1" /> Choose
                                                </Button>
                                            }
                                        />
                                        <Input
                                            className="h-8 text-xs flex-1"
                                            value={feature.imageSrc}
                                            onChange={(e) => updateFeature(index, 'imageSrc', e.target.value)}
                                            placeholder="Image URL..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AiFeaturesBlockEditor;
