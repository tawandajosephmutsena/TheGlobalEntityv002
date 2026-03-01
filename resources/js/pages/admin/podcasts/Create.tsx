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
import MediaLibrary from '@/components/admin/MediaLibrary';
import { MediaAsset } from '@/types';
import {
    Upload, X, Mic, Video, Image as ImageIcon, Tag,
    ChevronRight, ChevronLeft, Check, Rocket, Loader2, AlertCircle, Link
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
        media_url: '',
        media_type: 'audio' as 'audio' | 'video',
        thumbnail: '',
        podcast_category_id: '',
        season_number: '',
        episode_number: '',
        tags: [] as string[],
        is_published: false,
        published_at: '',
        duration: 0,
    });
    const [mediaSource, setMediaSource] = useState<'upload' | 'link'>('upload');
    const [mediaFileName, setMediaFileName] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleMediaSelect = (asset: MediaAsset) => {
        setFormData(prev => ({ 
            ...prev, 
            media_url: asset.url,
            media_type: asset.is_video ? 'video' : 'audio',
        }));
        setMediaFileName(asset.original_name);

        // Try to get duration from the file
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
        router.post(route('admin.podcasts.store'), formData as any, {
            onError: (errs) => {
                setErrors(errs);
                setIsSubmitting(false);
                // Go to step with error
                if (errs.media_url || errs.title) setStep(1);
                else if (errs.podcast_category_id) setStep(2);
            },
            onSuccess: () => setIsSubmitting(false),
        });
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
                                {/* File Source Tabs */}
                                <div className="flex gap-4 mb-4">
                                    <Button variant={mediaSource === 'upload' ? 'default' : 'outline'} onClick={() => { setMediaSource('upload'); setFormData(prev => ({...prev, media_url: ''})); }} type="button">
                                        <Upload className="size-4 mr-2" /> Select from Library
                                    </Button>
                                    <Button variant={mediaSource === 'link' ? 'default' : 'outline'} onClick={() => { setMediaSource('link'); setFormData(prev => ({...prev, media_url: ''})); }} type="button">
                                        <Link className="size-4 mr-2" /> External Link
                                    </Button>
                                </div>

                                {mediaSource === 'upload' ? (
                                    <MediaLibrary
                                        type="all"
                                        onSelect={handleMediaSelect}
                                        trigger={
                                            <div className="rounded-2xl border-2 border-dashed border-border hover:border-primary/50 transition-all p-8 text-center cursor-pointer group">
                                                {formData.media_url && !formData.media_url.startsWith('http') ? (
                                                    <div className="space-y-3">
                                                        <div className="size-14 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
                                                            <Check className="size-6 text-green-500" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold">{mediaFileName || 'Media Selected'}</p>
                                                        </div>
                                                        <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setFormData(prev => ({ ...prev, media_url: '' })); setMediaFileName(''); }} type="button">
                                                            <X className="size-3 mr-1" /> Remove
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        <div className="size-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                            <Upload className="size-7 text-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold">Select media from library</p>
                                                            <p className="text-sm text-muted-foreground mt-1">Supports MP3, WAV, M4A, MP4, WebM</p>
                                                        </div>
                                                        <Button variant="outline" type="button">Browse Library</Button>
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
                                    </div>
                                )}
                                {errors.media_url && <p className="text-sm text-destructive">{errors.media_url}</p>}

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
                                    <Button onClick={() => setStep(2)} disabled={!formData.title || !formData.media_url}>
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
                                        <MediaLibrary
                                            type="image"
                                            onSelect={handleThumbnailSelect}
                                            trigger={
                                                <div className="aspect-square max-w-[200px] rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-all cursor-pointer flex items-center justify-center overflow-hidden">
                                                    {formData.thumbnail ? (
                                                        <img src={formData.thumbnail.startsWith('http') ? formData.thumbnail : `/storage/${formData.thumbnail}`} alt="Thumbnail" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="text-center p-4">
                                                            <ImageIcon className="size-8 mx-auto text-muted-foreground mb-2" />
                                                            <p className="text-xs text-muted-foreground">Select artwork</p>
                                                        </div>
                                                    )}
                                                </div>
                                            }
                                        />
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
                                            <p className="text-muted-foreground">Media Source</p>
                                            <p className="font-medium truncate">{mediaSource === 'link' ? formData.media_url : mediaFileName || 'Library Media'}</p>
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
