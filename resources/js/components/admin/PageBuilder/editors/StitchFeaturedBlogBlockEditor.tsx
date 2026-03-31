import React from 'react';
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/Components/ui/button";
import { Plus, Trash2, GripVertical, Image as ImageIcon } from 'lucide-react';
import { Switch } from "@/Components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import type { StitchFeaturedBlogBlock } from '@/types/page-blocks';
import MediaLibrary from '@/Components/admin/MediaLibrary';
import type { MediaAsset } from '@/types';

interface StitchFeaturedBlogBlockEditorProps {
    content: StitchFeaturedBlogBlock['content'];
    onUpdate: (updates: Partial<StitchFeaturedBlogBlock['content']>) => void;
}

export default function StitchFeaturedBlogBlockEditor({ content, onUpdate }: StitchFeaturedBlogBlockEditorProps) {
    const handlePostChange = (index: number, updates: Partial<{ title: string; excerpt: string; image: string; author: string; date: string }>) => {
        const newPosts = [...(content.posts || [])];
        newPosts[index] = { ...newPosts[index], ...updates };
        onUpdate({ posts: newPosts });
    };

    const addPost = () => {
        onUpdate({ posts: [...(content.posts || []), { title: '', excerpt: '', image: '', author: '', date: '' }] });
    };

    const removePost = (index: number) => {
        const newPosts = (content.posts || []).filter((_, i) => i !== index);
        onUpdate({ posts: newPosts });
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label>Section Title</Label>
                    <Input 
                        value={content.title || ''} 
                        onChange={(e) => onUpdate({ title: e.target.value })} 
                        placeholder="e.g. Latest Stories"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Subtitle</Label>
                    <Input 
                        value={content.subtitle || ''} 
                        onChange={(e) => onUpdate({ subtitle: e.target.value })} 
                        placeholder="e.g. Deep dives into culture..."
                    />
                </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg bg-surface-container-lowest">
                <div className="space-y-0.5">
                    <Label className="text-base">Use Dynamic Posts</Label>
                    <p className="text-sm text-muted-foreground">
                        Automatically pull posts from a specific collection instead of selecting them manually.
                    </p>
                </div>
                <Switch
                    checked={content.useDynamicPosts || false}
                    onCheckedChange={(checked) => onUpdate({ useDynamicPosts: checked })}
                />
            </div>

            {content.useDynamicPosts ? (
                <div className="grid gap-4 sm:grid-cols-2 pt-4 border-t">
                    <div className="space-y-2">
                        <Label>Collection</Label>
                        <Select 
                            value={content.collection || 'insights'} 
                            onValueChange={(value) => onUpdate({ collection: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select collection" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="insights">Insights (Blog)</SelectItem>
                                <SelectItem value="portfolio">Portfolio</SelectItem>
                                <SelectItem value="services">Services</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Number of Posts to Show</Label>
                        <Input 
                            type="number"
                            min="1"
                            max="12"
                            value={content.limit || 3} 
                            onChange={(e) => onUpdate({ limit: parseInt(e.target.value) || 3 })} 
                        />
                    </div>
                </div>
            ) : (
                <div className="space-y-4 pt-4 border-t">
                    <Label>Featured Posts</Label>
                <div className="space-y-4">
                    {(content.posts || []).map((post, index) => (
                        <div key={index} className="p-4 border rounded-lg bg-surface-container-lowest space-y-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <GripVertical className="h-4 w-4 text-muted-foreground mr-2" />
                                    <span className="text-sm font-bold">Post #{index + 1}</span>
                                </div>
                                <Button 
                                    type="button"
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => removePost(index)}
                                    className="text-destructive h-8 w-8 p-0"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                            
                            <div className="space-y-2">
                                <Label className="text-xs">Post Title</Label>
                                <Input 
                                    value={post.title || ''} 
                                    onChange={(e) => handlePostChange(index, { title: e.target.value })}
                                    placeholder="Story Headline"
                                    className="h-9"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs">Excerpt</Label>
                                <Textarea 
                                    value={post.excerpt || ''} 
                                    onChange={(e) => handlePostChange(index, { excerpt: e.target.value })}
                                    placeholder="Brief summary..."
                                    rows={2}
                                />
                            </div>
                            
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="text-xs">Author</Label>
                                    <Input 
                                        value={post.author || ''} 
                                        onChange={(e) => handlePostChange(index, { author: e.target.value })}
                                        placeholder="e.g. Maya Silva"
                                        className="h-9"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Date</Label>
                                    <Input 
                                        value={post.date || ''} 
                                        onChange={(e) => handlePostChange(index, { date: e.target.value })}
                                        placeholder="e.g. Mar 15, 2024"
                                        className="h-9"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs">Post Image</Label>
                                <div className="flex gap-2">
                                    <MediaLibrary 
                                        onSelect={(asset: MediaAsset) => handlePostChange(index, { image: asset.url })}
                                        trigger={
                                            <Button type="button" variant="outline" size="sm" className="h-9">
                                                <ImageIcon className="h-4 w-4 mr-2" /> 
                                                {post.image ? 'Change' : 'Upload'}
                                            </Button>
                                        }
                                    />
                                    <Input 
                                        className="flex-1 h-9" 
                                        value={post.image || ''} 
                                        onChange={(e) => handlePostChange(index, { image: e.target.value })} 
                                        placeholder="Image URL..." 
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addPost} className="w-full h-10 border-dashed">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Featured Post
                </Button>
            </div>
            )}
        </div>
    );
}
