import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import MediaLibrary from '@/components/admin/MediaLibrary';
import { Separator } from '@/components/ui/separator';
import { MediaAsset } from '@/types';
import {
    X, Image as ImageIcon, Tag, Save, Loader2, AlertCircle, Upload, Link, Check
} from 'lucide-react';

declare function route(name: string, params?: unknown, absolute?: boolean): string;

interface PodcastCategory {
    id: number;
    name: string;
    slug: string;
    color: string;
}

interface PodcastData {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    content: string | null;
    media_url: string;
    media_type: 'audio' | 'video';
    thumbnail: string | null;
    thumbnail_url: string | null;
    duration: number;
    formatted_duration: string;
    file_size: number;
    podcast_category_id: number | null;
    season_number: number | null;
    episode_number: number | null;
    tags: string[] | null;
    is_published: boolean;
    is_featured: boolean;
    published_at: string | null;
    category_id: number | null;
    categories: { id: number; name: string }[];
    transcript_url: string | null;
    transcript_link_text: string | null;
}

interface Props {
    podcast: PodcastData;
    categories: PodcastCategory[];
}

export default function PodcastEdit({ podcast, categories }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: podcast.title,
        description: podcast.description || '',
        content: podcast.content || '',
        media_url: podcast.media_url,
        media_type: podcast.media_type,
        thumbnail: podcast.thumbnail || '',
        podcast_category_id: podcast.podcast_category_id ? String(podcast.podcast_category_id) : '',
        category_id: podcast.category_id ? String(podcast.category_id) : '',
        additional_categories: podcast.categories ? podcast.categories.map(c => c.id) : [],
        transcript_url: podcast.transcript_url || '',
        transcript_link_text: podcast.transcript_link_text || '',
        season_number: podcast.season_number ? String(podcast.season_number) : '',
        episode_number: podcast.episode_number ? String(podcast.episode_number) : '',
        tags: podcast.tags || [],
        is_published: podcast.is_published,
        published_at: podcast.published_at ? new Date(podcast.published_at).toISOString().slice(0, 16) : '',
        duration: podcast.duration,
    });
    
    // Check if current media is external
    const isUrl = podcast.media_url && (podcast.media_url.startsWith('http://') || podcast.media_url.startsWith('https://'));
    const [mediaSource, setMediaSource] = useState<'upload' | 'link'>(isUrl ? 'link' : 'upload');
    const [mediaFileName, setMediaFileName] = useState(podcast.media_url ? podcast.media_url.split('/').pop() || 'Media File' : '');
    
    const [tagInput, setTagInput] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleMediaSelect = (asset: MediaAsset) => {
        setFormData(prev => ({ 
            ...prev, 
            media_url: asset.url,
            media_type: asset.is_video ? 'video' : 'audio',
        }));
        setMediaFileName(asset.original_name);
        
        // Try to estimate duration
        const url = asset.url;
        const media = document.createElement(asset.is_video ? 'video' : 'audio');
        media.preload = 'metadata';
        media.onloadedmetadata = () => {
            if (media.duration && isFinite(media.duration)) {
                setFormData(prev => ({ ...prev, duration: Math.round(media.duration) }));
            }
        };
        media.src = url;
    };

    const handleThumbnailSelect = (asset: MediaAsset) => {
        setFormData(prev => ({ ...prev, thumbnail: asset.url }));
    };

    const addTag = () => {
        const tag = tagInput.trim();
        if (tag && !formData.tags.includes(tag)) {
            setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
            setTagInput('');
        }
    };

    const removeTag = (tag: string) => {
        setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        router.put(route('admin.podcasts.update', { podcast: podcast.id }), formData as unknown as Record<string, string>, {
            onError: (errs) => {
                setErrors(errs);
                setIsSubmitting(false);
            },
            onSuccess: () => setIsSubmitting(false),
        });
    };

    return (
        <AdminLayout title={`Edit: ${podcast.title}`} breadcrumbs={[
            { title: 'Podcasts', href: '/admin/podcasts' },
            { title: 'Edit', href: '#' },
        ]}>
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Edit Episode</h1>
                    <p className="text-muted-foreground text-sm mt-1">Update podcast details and republish.</p>
                </div>

                {Object.keys(errors).length > 0 && (
                    <div className="rounded-lg bg-destructive/15 text-destructive p-4 flex items-start gap-3">
                        <AlertCircle className="size-5 mt-0.5 shrink-0" />
                        <div>
                            <p className="font-bold">Please fix the following errors:</p>
                            <ul className="list-disc list-inside text-sm mt-1">
                                {Object.entries(errors).map(([field, msg]) => (
                                    <li key={field}>{msg}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Main form */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title">Episode Title *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            />
                            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                rows={5}
                            />
                        </div>

                        {/* Show Notes */}
                        <div className="space-y-2">
                            <Label htmlFor="content">Show Notes (Extended)</Label>
                            <Textarea
                                id="content"
                                value={formData.content}
                                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                                rows={8}
                            placeholder="Links, timestamps, credits..."
                        />
                    </div>

                    {/* Transcript / Blog Link */}
                    <div className="rounded-xl border border-border p-6 space-y-4">
                        <h3 className="font-bold text-sm">Transcript & External Links</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="transcript_url">Transcript / Blog URL</Label>
                                <div className="relative">
                                    <Link className="absolute left-3 top-3 size-4 text-muted-foreground" />
                                    <Input
                                        id="transcript_url"
                                        className="pl-9"
                                        value={formData.transcript_url}
                                        onChange={(e) => setFormData(prev => ({ ...prev, transcript_url: e.target.value }))}
                                        placeholder="https://tge.test/insights/..."
                                    />
                                </div>
                                {errors.transcript_url && <p className="text-sm text-destructive">{errors.transcript_url}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="transcript_link_text">Button Text</Label>
                                <Input
                                    id="transcript_link_text"
                                    value={formData.transcript_link_text}
                                    onChange={(e) => setFormData(prev => ({ ...prev, transcript_link_text: e.target.value }))}
                                    placeholder="e.g. Read Full Transcript"
                                />
                                {errors.transcript_link_text && <p className="text-sm text-destructive">{errors.transcript_link_text}</p>}
                            </div>
                        </div>
                    </div>

                        {/* Replace Media */}
                        <div className="rounded-xl border border-border p-6 space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <h3 className="font-bold text-sm">Media File</h3>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Current format: {podcast.media_type === 'video' ? '🎥' : '🎧'} {podcast.formatted_duration || 'Unknown Runtime'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 mb-4">
                                <Button variant={mediaSource === 'upload' ? 'default' : 'outline'} onClick={() => { setMediaSource('upload'); }} type="button">
                                    <Upload className="size-4 mr-2" /> Select from Library
                                </Button>
                                <Button variant={mediaSource === 'link' ? 'default' : 'outline'} onClick={() => { setMediaSource('link'); }} type="button">
                                    <Link className="size-4 mr-2" /> External Link
                                </Button>
                            </div>

                            {mediaSource === 'upload' ? (
                                <MediaLibrary
                                    type="all"
                                    onSelect={handleMediaSelect}
                                    trigger={
                                        <div className="rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-all p-6 text-center cursor-pointer group">
                                            {formData.media_url && !formData.media_url.startsWith('http') ? (
                                                <div className="space-y-3">
                                                    <div className="size-12 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
                                                        <Check className="size-5 text-green-500" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm truncate max-w-[200px] mx-auto">{mediaFileName || 'Media Selected'}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    <div className="size-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                        <Upload className="size-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm">Select media from library</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    }
                                />
                            ) : (
                                <div className="space-y-4 rounded-2xl border bg-muted/20 p-6">
                                    <div>
                                        <Label htmlFor="media_url">External URL</Label>
                                        <Input
                                            id="media_url"
                                            placeholder="e.g. https://www.youtube.com/watch?v=..."
                                            value={formData.media_url}
                                            onChange={(e) => {
                                                const url = e.target.value;
                                                setFormData(prev => ({ 
                                                    ...prev, 
                                                    media_url: url,
                                                    media_type: url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com') ? 'video' : prev.media_type
                                                }));
                                            }}
                                        />
                                    </div>
                                    <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-3 text-xs space-y-1.5">
                                        <p className="font-semibold text-blue-600 dark:text-blue-400">ℹ️ How video links work</p>
                                        <ul className="text-muted-foreground space-y-1 list-disc list-inside">
                                            <li><strong>YouTube / Vimeo:</strong> A thumbnail preview is shown. The video loads only when the viewer clicks play. A &quot;Watch on YouTube&quot; fallback link is also provided.</li>
                                            <li><strong>Direct files</strong> (MP4, WebM): The browser&apos;s native player is used with a poster frame from the first second.</li>
                                            <li><strong>Best quality:</strong> For the smoothest playback, upload the video file directly via &quot;Select from Library&quot;.</li>
                                        </ul>
                                    </div>
                                </div>
                            )}
                            {errors.media_url && <p className="text-sm text-destructive">{errors.media_url}</p>}
                        </div>

                        {/* Tags */}
                        <div className="space-y-3">
                            <Label>Tags</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    placeholder="Add a tag..."
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                />
                                <Button variant="outline" size="icon" onClick={addTag} type="button" title="Add tag" aria-label="Add tag">
                                    <Tag className="size-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="gap-1">
                                        {tag}
                                        <button onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive" title={`Remove tag ${tag}`} aria-label={`Remove tag ${tag}`}>
                                            <X className="size-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Thumbnail */}
                        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                            <h3 className="font-bold text-sm">Episode Artwork</h3>
                            <MediaLibrary
                                type="image"
                                onSelect={handleThumbnailSelect}
                                trigger={
                                    <div className="aspect-square rounded-lg border border-dashed border-border overflow-hidden cursor-pointer hover:border-primary/50 transition-all">
                                        {formData.thumbnail ? (
                                            <img src={formData.thumbnail.startsWith('http') ? formData.thumbnail : `/storage/${formData.thumbnail}`} alt="Thumbnail" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center p-4 text-center">
                                                <div>
                                                    <ImageIcon className="size-8 mx-auto text-muted-foreground mb-2" />
                                                    <p className="text-xs text-muted-foreground">Select artwork</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                }
                            />
                        </div>

                        <div className="rounded-xl border border-border bg-card p-4 space-y-4">
                            <h3 className="font-bold text-sm">Categories</h3>
                            <div className="space-y-2">
                                <Label>Primary Category</Label>
                                <Select
                                    value={String(formData.category_id)}
                                    onValueChange={(v) => setFormData(prev => ({ ...prev, category_id: v }))}
                                >
                                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                    <SelectContent>
                                        {categories.map(cat => (
                                            <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.category_id && <p className="text-sm text-destructive">{errors.category_id}</p>}
                            </div>
                            
                            <div className="space-y-2">
                                <Label>Additional Categories</Label>
                                <div className="flex flex-col gap-2 p-3 rounded-lg border bg-muted/20">
                                    {categories.filter(c => String(c.id) !== String(formData.category_id)).map(cat => (
                                        <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
                                            <div 
                                                className={`size-4 rounded border flex items-center justify-center transition-colors ${
                                                    formData.additional_categories.includes(cat.id) 
                                                        ? 'bg-primary border-primary text-primary-foreground' 
                                                        : 'bg-background border-input group-hover:border-primary/50'
                                                }`}
                                                onClick={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        additional_categories: prev.additional_categories.includes(cat.id)
                                                            ? prev.additional_categories.filter(id => id !== cat.id)
                                                            : [...prev.additional_categories, cat.id]
                                                    }));
                                                }}
                                            >
                                                {formData.additional_categories.includes(cat.id) && <Check className="size-2.5 stroke-[3]" />}
                                            </div>
                                            <span className="text-xs">{cat.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <Separator className="my-2" />

                            <div className="space-y-2">
                                <Label>Media Type</Label>
                                <Select
                                    value={formData.media_type}
                                    onValueChange={(v) => setFormData(prev => ({ ...prev, media_type: v as 'audio' | 'video' }))}
                                >
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="audio">Audio</SelectItem>
                                        <SelectItem value="video">Video</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label>Season</Label>
                                    <Input
                                        type="number" min={1}
                                        value={formData.season_number}
                                        onChange={(e) => setFormData(prev => ({ ...prev, season_number: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Episode</Label>
                                    <Input
                                        type="number" min={1}
                                        value={formData.episode_number}
                                        onChange={(e) => setFormData(prev => ({ ...prev, episode_number: e.target.value }))}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Publishing */}
                        <div className="rounded-xl border border-border bg-card p-4 space-y-4">
                            <h3 className="font-bold text-sm">Publishing</h3>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Published</span>
                                <Switch
                                    checked={formData.is_published}
                                    onCheckedChange={(v) => setFormData(prev => ({ ...prev, is_published: v }))}
                                />
                            </div>
                            {!formData.is_published && (
                                <div className="space-y-2">
                                    <Label>Schedule</Label>
                                    <Input
                                        type="datetime-local"
                                        value={formData.published_at}
                                        onChange={(e) => setFormData(prev => ({ ...prev, published_at: e.target.value }))}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full gap-2">
                            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                            Save Changes
                        </Button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
