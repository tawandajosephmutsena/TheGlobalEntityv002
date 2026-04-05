import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Insight, Category, User } from '@/types';
import { useForm, Link } from '@inertiajs/react';
import React, { useEffect, useRef } from 'react';
import { Save, ArrowLeft, ImagePlus, X, Plus, History, Eye } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import MediaLibrary from '@/components/admin/MediaLibrary';
import RichTextEditor from '@/components/admin/RichTextEditor';
import VersionHistory from '@/components/admin/VersionHistory';
import VersionComparison from '@/components/admin/VersionComparison';
import RealTimePreview from '@/components/admin/RealTimePreview';
import PreviewShare from '@/components/admin/PreviewShare';
import { accessibilityManager } from '@/lib/accessibilityManager';

interface Props {
    insight?: any; // any to bypass strict type for now given additional fields
    categories: Category[];
    authors: User[];
    podcasts?: { id: number; title: string }[];
    festivals?: { id: number; name: string }[];
}

export default function InsightForm({ insight, categories, authors, podcasts = [], festivals = [] }: Props) {
    // Helper to format date for datetime-local input (YYYY-MM-DDTHH:mm)
    const formatDateForInput = (dateString: string | null) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const { data, setData, post, put, processing, errors } = useForm<{
        title: string;
        slug: string;
        excerpt: string;
        content: { body: string };
        featured_image: string;
        author_id: string | number;
        category_id: string | number;
        additional_categories: number[];
        podcast_id: string | number;
        festival_id: string | number;
        tags: string[];
        reading_time: number;
        is_published: boolean;
        is_featured: boolean;
        published_at: string;
    }>({
        title: insight?.title || '',
        slug: insight?.slug || '',
        excerpt: insight?.excerpt || '',
        content: (insight?.content as { body: string }) || { body: '' },
        featured_image: insight?.featured_image || '',
        author_id: insight?.author_id || authors[0]?.id || '',
        category_id: insight?.category_id || categories[0]?.id || '',
        additional_categories: insight?.additionalCategories?.map((c: any) => c.id) || [],
        podcast_id: insight?.podcast_id || '',
        festival_id: insight?.festival_id || '',
        tags: insight?.tags || [],
        reading_time: insight?.reading_time || 5,
        is_published: insight?.is_published ?? false,
        is_featured: insight?.is_featured ?? false,
        published_at: insight?.published_at ? formatDateForInput(insight.published_at) : '',
    });

    // Auto-generate slug from title
    useEffect(() => {
        if (!insight && data.title) {
            const generatedSlug = data.title
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '-')
                .replace(/^-+|-+$/g, '');
            setData('slug', generatedSlug);
        }
    }, [data.title, insight]);

    const [newTag, setNewTag] = React.useState('');
    const [showVersionHistory, setShowVersionHistory] = React.useState(false);
    const [showVersionComparison, setShowVersionComparison] = React.useState(false);
    const [comparisonVersions, setComparisonVersions] = React.useState<[number, number] | null>(null);
    const [showPreview, setShowPreview] = React.useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (formRef.current) {
            accessibilityManager.enhanceFormAccessibility(formRef.current);
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Debug: log what we're sending
        const contentLength = data.content?.body?.length || 0;
        const jsonLength = JSON.stringify(data).length;
        console.log('[Insight Save] Content length:', contentLength, 'Total JSON:', jsonLength);
        console.log('[Insight Save] Data keys:', Object.keys(data));
        console.log('[Insight Save] Content body preview:', data.content?.body?.substring(0, 200));
        
        const options = {
            onError: (formErrors: Record<string, string>) => {
                console.error('[Insight Save] Validation errors:', formErrors);
                // Scroll to top to show the error banner
                window.scrollTo({ top: 0, behavior: 'smooth' });
                // Show all errors as alert so user always sees them
                const errorMessages = Object.entries(formErrors).map(([k, v]) => `${k}: ${v}`).join('\n');
                alert('Save failed with validation errors:\n' + errorMessages);
            },
            onSuccess: () => {
                console.log('[Insight Save] Success!');
                localStorage.removeItem(`insight-draft-${insight?.id || 'new'}`);
            },
        };
        
        console.log('[Insight Save] Submitting...');
        if (insight) {
            put(`/admin/insights/${insight.slug}`, options);
        } else {
            post('/admin/insights', options);
        }
    };

    const addTag = () => {
        if (newTag && !data.tags.includes(newTag)) {
            setData('tags', [...data.tags, newTag]);
            setNewTag('');
        }
    };

    const removeTag = (tag: string) => {
        setData('tags', data.tags.filter((t) => t !== tag));
    };

    const handleVersionRestore = () => {
        // Refresh the page to load the restored content
        window.location.reload();
    };

    const handleVersionCompare = (version1: number, version2: number) => {
        setComparisonVersions([version1, version2]);
        setShowVersionComparison(true);
        setShowVersionHistory(false);
    };

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            {/* Global validation errors */}
            {Object.keys(errors).length > 0 && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                    <p className="text-sm font-medium text-destructive mb-1">Please fix the following errors:</p>
                    <ul className="list-disc list-inside text-sm text-destructive/80">
                        {Object.entries(errors).map(([key, msg]) => (
                            <li key={key}>{msg}</li>
                        ))}
                    </ul>
                </div>
            )}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/insights">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {insight ? 'Edit Article' : 'New Article'}
                    </h1>
                </div>
                <Button type="submit" disabled={processing} className="bg-agency-accent text-agency-primary hover:bg-agency-accent/90">
                    <Save className="h-4 w-4 mr-2" />
                    {insight ? 'Update Article' : 'Publish Article'}
                </Button>
                {insight && (
                    <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowVersionHistory(!showVersionHistory)}
                        className="gap-2"
                    >
                        <History className="h-4 w-4" />
                        Version History
                    </Button>
                )}
                <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowPreview(!showPreview)}
                    className="gap-2"
                >
                    <Eye className="h-4 w-4" />
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Article Content</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="The Future of Digital Design"
                                />
                                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="excerpt">Excerpt</Label>
                                <Textarea
                                    id="excerpt"
                                    value={data.excerpt}
                                    onChange={(e) => setData('excerpt', e.target.value)}
                                    placeholder="A brief summary for the blog list..."
                                    rows={3}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>Content</Label>
                                <RichTextEditor
                                    content={data.content.body}
                                    onChange={(content) => setData('content', { ...data.content, body: content })}
                                    placeholder="Write your article here..."
                                    limit={500000}
                                    autoSave={true}
                                    onSave={(content) => {
                                        // Auto-save functionality - could save to localStorage or send to server
                                        localStorage.setItem(`insight-draft-${insight?.id || 'new'}`, content);
                                    }}
                                    showWordCount={true}
                                    showTableOfContents={true}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Rich text editor with auto-save, media integration, and advanced formatting options.
                                </p>
                                {(errors as Record<string, string>)['content.body'] && (
                                    <p className="text-sm text-destructive mt-1">{(errors as Record<string, string>)['content.body']}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Publishing</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>Published</Label>
                                <Switch
                                    checked={data.is_published}
                                    onCheckedChange={(checked) => setData('is_published', checked)}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label>Featured</Label>
                                <Switch
                                    checked={data.is_featured}
                                    onCheckedChange={(checked) => setData('is_featured', checked)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="published_at">Publication Date</Label>
                                <Input
                                    id="published_at"
                                    type="datetime-local"
                                    value={data.published_at}
                                    onChange={(e) => setData('published_at', e.target.value)}
                                    className="bg-background border-agency-accent/20 focus:border-agency-accent/50 focus:ring-agency-accent/20"
                                />
                                {errors.published_at && (
                                    <p className="text-sm text-destructive mt-1">{errors.published_at}</p>
                                )}
                            </div>
                            <div className="grid gap-2 text-xs">
                               <Label>Author</Label>
                               <Select 
                                    value={data.author_id.toString()} 
                                    onValueChange={(val) => setData('author_id', parseInt(val))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select author" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {authors.map(author => (
                                            <SelectItem key={author.id} value={author.id.toString()}>
                                                {author.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                               </Select>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Cataloging</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Primary Category</Label>
                                <Select 
                                    value={data.category_id?.toString()} 
                                    onValueChange={(val) => setData('category_id', parseInt(val))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(cat => (
                                            <SelectItem key={cat.id} value={cat.id.toString()}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.category_id && <p className="text-sm text-destructive">{errors.category_id}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label>Additional Categories</Label>
                                <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto border rounded-md p-3 bg-card">
                                    {categories.map(cat => (
                                        <div key={cat.id} className="flex items-center space-x-2">
                                            <Checkbox 
                                                id={`add-cat-${cat.id}`} 
                                                checked={data.additional_categories.includes(cat.id)}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setData('additional_categories', [...data.additional_categories, cat.id]);
                                                    } else {
                                                        setData('additional_categories', data.additional_categories.filter(id => id !== cat.id));
                                                    }
                                                }}
                                            />
                                            <label 
                                                htmlFor={`add-cat-${cat.id}`}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                {cat.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label>Link Podcast</Label>
                                <Select 
                                    value={data.podcast_id ? data.podcast_id.toString() : "none"} 
                                    onValueChange={(val) => setData('podcast_id', val === "none" ? '' : parseInt(val))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select podcast" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">None</SelectItem>
                                        {podcasts.map(podcast => (
                                            <SelectItem key={podcast.id} value={podcast.id.toString()}>
                                                {podcast.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label>Link Festival</Label>
                                <Select 
                                    value={data.festival_id ? data.festival_id.toString() : "none"} 
                                    onValueChange={(val) => setData('festival_id', val === "none" ? '' : parseInt(val))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select festival" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">None</SelectItem>
                                        {festivals.map(festival => (
                                            <SelectItem key={festival.id} value={festival.id.toString()}>
                                                {festival.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Tags</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        placeholder="Add tag..."
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                    />
                                    <Button type="button" size="icon" onClick={addTag} variant="outline">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {data.tags.map(tag => (
                                         <Badge key={tag} variant="secondary" className="gap-1 px-1.5">
                                            {tag}
                                            <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                                         </Badge>
                                    ))}
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="reading_time">Reading Time (min)</Label>
                                <Input
                                    id="reading_time"
                                    type="number"
                                    value={data.reading_time}
                                    onChange={(e) => setData('reading_time', parseInt(e.target.value))}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Featured Image</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <MediaLibrary 
                                type="image"
                                currentValue={data.featured_image}
                                onSelect={(asset) => setData('featured_image', asset.url)}
                                trigger={
                                    <div 
                                        className="aspect-video rounded border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-muted mb-3 overflow-hidden bg-muted/20"
                                    >
                                        {data.featured_image ? (
                                            <img src={data.featured_image} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <ImagePlus className="h-8 w-8 text-muted-foreground" />
                                        )}
                                    </div>
                                }
                            />
                            <Input
                                value={data.featured_image}
                                onChange={(e) => setData('featured_image', e.target.value)}
                                placeholder="Image URL"
                                className="text-xs"
                            />
                        </CardContent>
                    </Card>

                    {insight && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Preview Sharing</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <PreviewShare
                                    contentType="insight"
                                    contentId={insight.id}
                                    contentTitle={data.title}
                                />
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Version History and Comparison */}
            {insight && showVersionHistory && !showVersionComparison && (
                <div className="mt-6">
                    <VersionHistory
                        contentType="insight"
                        contentId={insight.id}
                        onRestore={handleVersionRestore}
                        onCompare={handleVersionCompare}
                    />
                </div>
            )}

            {insight && showVersionComparison && comparisonVersions && (
                <div className="mt-6">
                    <VersionComparison
                        contentType="insight"
                        contentId={insight.id}
                        version1={comparisonVersions[0]}
                        version2={comparisonVersions[1]}
                        onClose={() => {
                            setShowVersionComparison(false);
                            setShowVersionHistory(true);
                            setComparisonVersions(null);
                        }}
                    />
                </div>
            )}

            {/* Real-time Preview */}
            <RealTimePreview
                data={{
                    ...data,
                    author_id: typeof data.author_id === 'string' ? parseInt(data.author_id) : data.author_id,
                    category_id: typeof data.category_id === 'string' ? parseInt(data.category_id) : data.category_id,
                }}
                contentType="insight"
                isVisible={showPreview}
                onToggle={() => setShowPreview(!showPreview)}
            />
        </form>
    );
}
