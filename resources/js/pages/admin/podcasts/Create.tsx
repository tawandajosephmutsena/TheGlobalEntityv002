import React, { useState, useCallback } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
    Upload, X, Mic, Video, Image as ImageIcon, Tag,
    ChevronRight, ChevronLeft, Check, Rocket, Loader2, AlertCircle
} from 'lucide-react';

declare function route(name: string, params?: unknown, absolute?: boolean): string;

interface PodcastCategory {
    id: number;
    name: string;
    slug: string;
    color: string;
}

interface Props {
    categories: PodcastCategory[];
}

export default function PodcastCreate({ categories }: Props) {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: '',
        media_type: 'audio' as 'audio' | 'video',
        podcast_category_id: '',
        season_number: '',
        episode_number: '',
        tags: [] as string[],
        is_published: false,
        published_at: '',
        duration: 0,
    });
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [tagInput, setTagInput] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleMediaDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) handleMediaSelect(file);
    }, []);

    const handleMediaSelect = (file: File) => {
        setMediaFile(file);
        // Auto-detect media type
        if (file.type.startsWith('video/')) {
            setFormData(prev => ({ ...prev, media_type: 'video' }));
        } else {
            setFormData(prev => ({ ...prev, media_type: 'audio' }));
        }

        // Try to get duration from the file
        const url = URL.createObjectURL(file);
        const media = document.createElement(file.type.startsWith('video/') ? 'video' : 'audio');
        media.preload = 'metadata';
        media.onloadedmetadata = () => {
            if (media.duration && isFinite(media.duration)) {
                setFormData(prev => ({ ...prev, duration: Math.round(media.duration) }));
            }
            URL.revokeObjectURL(url);
        };
        media.src = url;
    };

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
        router.post(route('admin.podcasts.store'), data as any, {
            forceFormData: true,
            onError: (errs) => {
                setErrors(errs);
                setIsSubmitting(false);
                // Go to step with error
                if (errs.media_file || errs.title) setStep(1);
                else if (errs.podcast_category_id) setStep(2);
            },
            onSuccess: () => setIsSubmitting(false),
        });
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const steps = [
        { number: 1, title: 'File & Metadata', description: 'Upload and describe' },
        { number: 2, title: 'Details', description: 'Category & Tags' },
        { number: 3, title: 'Publish', description: 'Review & Publish' },
    ];

    return (
        <AdminLayout title="New Podcast" breadcrumbs={[
            { title: 'Podcasts', href: '/admin/podcasts' },
            { title: 'Create', href: '/admin/podcasts/create' },
        ]}>
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main form */}
                    <div className="flex-1 space-y-8">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Upload New Episode</h1>
                            <p className="text-muted-foreground text-sm mt-1">Add your audio or video content and provide details for publishing.</p>
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

                        {/* Step 1: File & Metadata */}
                        {step === 1 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                {/* File upload */}
                                <div
                                    className="rounded-2xl border-2 border-dashed border-border hover:border-primary/50 transition-all p-8 text-center cursor-pointer group"
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={handleMediaDrop}
                                    onClick={() => document.getElementById('media-input')?.click()}
                                >
                                    <input
                                        id="media-input"
                                        type="file"
                                        accept="audio/*,video/*"
                                        className="hidden"
                                        onChange={(e) => e.target.files?.[0] && handleMediaSelect(e.target.files[0])}
                                    />

                                    {mediaFile ? (
                                        <div className="space-y-3">
                                            <div className="size-14 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
                                                <Check className="size-6 text-green-500" />
                                            </div>
                                            <div>
                                                <p className="font-bold">{mediaFile.name}</p>
                                                <p className="text-sm text-muted-foreground">{formatFileSize(mediaFile.size)}</p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={(e) => { e.stopPropagation(); setMediaFile(null); }}
                                            >
                                                <X className="size-3 mr-1" /> Remove
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="size-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                <Upload className="size-7 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-bold">Drag & drop your media file</p>
                                                <p className="text-sm text-muted-foreground mt-1">Supports MP3, WAV, M4A, MP4, WebM up to 500MB</p>
                                            </div>
                                            <Button variant="outline" type="button">Browse Files</Button>
                                        </div>
                                    )}
                                </div>
                                {errors.media_file && <p className="text-sm text-destructive">{errors.media_file}</p>}

                                {/* Title & Description */}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Episode Title *</Label>
                                        <Input
                                            id="title"
                                            value={formData.title}
                                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                            placeholder="e.g. The Future of AI in Creative Industries"
                                        />
                                        {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                            placeholder="Write a brief overview of what this episode covers..."
                                            rows={5}
                                        />
                                        <p className="text-xs text-muted-foreground text-right">{formData.description.length} / 5000</p>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button onClick={() => setStep(2)} disabled={!formData.title || !mediaFile}>
                                        Next: Details <ChevronRight className="size-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Details */}
                        {step === 2 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Thumbnail */}
                                    <div className="space-y-3">
                                        <Label>Episode Artwork</Label>
                                        <div
                                            className="aspect-square max-w-[200px] rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-all cursor-pointer flex items-center justify-center overflow-hidden"
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
                                                <img src={thumbnailPreview} alt="Thumbnail" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="text-center p-4">
                                                    <ImageIcon className="size-8 mx-auto text-muted-foreground mb-2" />
                                                    <p className="text-xs text-muted-foreground">Upload artwork</p>
                                                </div>
                                            )}
                                        </div>
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

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Category</Label>
                                        <Select
                                            value={formData.podcast_category_id}
                                            onValueChange={(v) => setFormData(prev => ({ ...prev, podcast_category_id: v }))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
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
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="audio"><Mic className="size-3 inline mr-2" />Audio</SelectItem>
                                                <SelectItem value="video"><Video className="size-3 inline mr-2" />Video</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Season Number</Label>
                                        <Input
                                            type="number"
                                            min={1}
                                            value={formData.season_number}
                                            onChange={(e) => setFormData(prev => ({ ...prev, season_number: e.target.value }))}
                                            placeholder="e.g. 1"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Episode Number</Label>
                                        <Input
                                            type="number"
                                            min={1}
                                            value={formData.episode_number}
                                            onChange={(e) => setFormData(prev => ({ ...prev, episode_number: e.target.value }))}
                                            placeholder="e.g. 24"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between">
                                    <Button variant="outline" onClick={() => setStep(1)}>
                                        <ChevronLeft className="size-4 mr-1" /> Back
                                    </Button>
                                    <Button onClick={() => setStep(3)}>
                                        Next: Review <ChevronRight className="size-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Review & Publish */}
                        {step === 3 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                                    <h3 className="font-bold text-lg">Review Episode</h3>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">Title</p>
                                            <p className="font-medium">{formData.title}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Media Type</p>
                                            <p className="font-medium capitalize">{formData.media_type}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">File</p>
                                            <p className="font-medium truncate">{mediaFile?.name || '—'}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Category</p>
                                            <p className="font-medium">
                                                {categories.find(c => String(c.id) === formData.podcast_category_id)?.name || '—'}
                                            </p>
                                        </div>
                                        {formData.tags.length > 0 && (
                                            <div className="col-span-2">
                                                <p className="text-muted-foreground mb-1">Tags</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {formData.tags.map(tag => (
                                                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Publish settings */}
                                <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                                    <h3 className="font-bold text-lg">Publishing</h3>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Publish immediately</p>
                                            <p className="text-sm text-muted-foreground">Make this episode available to listeners</p>
                                        </div>
                                        <Switch
                                            checked={formData.is_published}
                                            onCheckedChange={(v) => setFormData(prev => ({ ...prev, is_published: v }))}
                                        />
                                    </div>

                                    {!formData.is_published && (
                                        <div className="space-y-2">
                                            <Label>Schedule for later (optional)</Label>
                                            <Input
                                                type="datetime-local"
                                                value={formData.published_at}
                                                onChange={(e) => setFormData(prev => ({ ...prev, published_at: e.target.value }))}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between">
                                    <Button variant="outline" onClick={() => setStep(2)}>
                                        <ChevronLeft className="size-4 mr-1" /> Back
                                    </Button>
                                    <div className="flex gap-3">
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setFormData(prev => ({ ...prev, is_published: false }));
                                                handleSubmit();
                                            }}
                                            disabled={isSubmitting}
                                        >
                                            Save as Draft
                                        </Button>
                                        <Button onClick={handleSubmit} disabled={isSubmitting} className="gap-2">
                                            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Rocket className="size-4" />}
                                            {formData.is_published ? 'Publish Episode' : 'Save Episode'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar - Progress Steps */}
                    <aside className="w-full lg:w-64 shrink-0">
                        <div className="sticky top-24 space-y-6">
                            <div className="rounded-xl border border-border bg-card p-5">
                                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Upload Progress</h4>
                                <nav className="space-y-4">
                                    {steps.map((s, i) => (
                                        <div key={s.number} className="flex items-start gap-3">
                                            <div className="flex flex-col items-center">
                                                <div className={`size-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                                    step > s.number
                                                        ? 'bg-primary text-primary-foreground'
                                                        : step === s.number
                                                        ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                                                        : 'bg-muted text-muted-foreground'
                                                }`}>
                                                    {step > s.number ? <Check className="size-3.5" /> : s.number}
                                                </div>
                                                {i < steps.length - 1 && (
                                                    <div className={`w-0.5 h-8 mt-1 ${step > s.number ? 'bg-primary/30' : 'bg-border'}`} />
                                                )}
                                            </div>
                                            <div className="pt-0.5">
                                                <p className={`text-sm font-medium ${step === s.number ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                    {s.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground">{s.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </nav>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </AdminLayout>
    );
}
