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
import {
    X, Image as ImageIcon, Tag, Save, Loader2, AlertCircle
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
        media_type: podcast.media_type,
        podcast_category_id: podcast.podcast_category_id ? String(podcast.podcast_category_id) : '',
        season_number: podcast.season_number ? String(podcast.season_number) : '',
        episode_number: podcast.episode_number ? String(podcast.episode_number) : '',
        tags: podcast.tags || [],
        is_published: podcast.is_published,
        published_at: podcast.published_at ? new Date(podcast.published_at).toISOString().slice(0, 16) : '',
        duration: podcast.duration,
    });
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(podcast.thumbnail_url);
    const [tagInput, setTagInput] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleThumbnailSelect = (file: File) => {
        setThumbnail(file);
        const reader = new FileReader();
        reader.onloadend = () => setThumbnailPreview(reader.result as string);
        reader.readAsDataURL(file);
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
        const data = new FormData();
        data.append('_method', 'PUT');
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('content', formData.content);
        data.append('media_type', formData.media_type);
        data.append('is_published', formData.is_published ? '1' : '0');
        data.append('duration', String(formData.duration));

        if (mediaFile) data.append('media_file', mediaFile);
        if (thumbnail) data.append('thumbnail', thumbnail);
        if (formData.podcast_category_id) data.append('podcast_category_id', formData.podcast_category_id);
        if (formData.season_number) data.append('season_number', formData.season_number);
        if (formData.episode_number) data.append('episode_number', formData.episode_number);
        if (formData.published_at) data.append('published_at', formData.published_at);
        formData.tags.forEach((tag, i) => data.append(`tags[${i}]`, tag));

        setIsSubmitting(true);
        router.post(route('admin.podcasts.update', { podcast: podcast.id }), data as any, {
            forceFormData: true,
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

                        {/* Replace Media */}
                        <div className="rounded-xl border border-border p-4 space-y-3">
                            <h3 className="font-bold text-sm">Replace Media File</h3>
                            <p className="text-xs text-muted-foreground">
                                Current: {podcast.media_type === 'video' ? '🎥' : '🎧'} {podcast.formatted_duration}
                            </p>
                            <Input
                                type="file"
                                accept="audio/*,video/*"
                                onChange={(e) => e.target.files?.[0] && setMediaFile(e.target.files[0])}
                            />
                            {mediaFile && (
                                <p className="text-xs text-green-600">New file: {mediaFile.name}</p>
                            )}
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
                                <Button variant="outline" size="icon" onClick={addTag} type="button">
                                    <Tag className="size-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="gap-1">
                                        {tag}
                                        <button onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive">
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
                            <div
                                className="aspect-square rounded-lg border border-dashed border-border overflow-hidden cursor-pointer hover:border-primary/50 transition-all"
                                onClick={() => document.getElementById('thumb-input')?.click()}
                            >
                                <input
                                    id="thumb-input"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => e.target.files?.[0] && handleThumbnailSelect(e.target.files[0])}
                                />
                                {thumbnailPreview ? (
                                    <img src={thumbnailPreview} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ImageIcon className="size-8 text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Settings */}
                        <div className="rounded-xl border border-border bg-card p-4 space-y-4">
                            <h3 className="font-bold text-sm">Settings</h3>
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select
                                    value={formData.podcast_category_id}
                                    onValueChange={(v) => setFormData(prev => ({ ...prev, podcast_category_id: v }))}
                                >
                                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                    <SelectContent>
                                        {categories.map(cat => (
                                            <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
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
