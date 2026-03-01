import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { AdminLayout } from '@/layouts/AdminLayout';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Plus, Search, MoreVertical, Edit, Trash2, Eye, Star, StarOff,
    Play, Clock, Headphones, Video, TrendingUp, Mic, BarChart3,
} from 'lucide-react';
import { PodcastCategoryBadge } from '@/components/podcast/PodcastCategoryBadge';

declare function route(name: string, params?: unknown, absolute?: boolean): string;

interface PodcastItem {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    media_type: 'audio' | 'video';
    thumbnail_url: string | null;
    formatted_duration: string;
    play_count: number;
    is_published: boolean;
    is_featured: boolean;
    published_at: string | null;
    created_at: string;
    category: { id: number; name: string; color: string } | null;
    author: { id: number; name: string } | null;
}

interface PodcastCategory {
    id: number;
    name: string;
    slug: string;
    color: string;
}

interface Props {
    podcasts: {
        data: PodcastItem[];
        current_page: number;
        last_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    categories: PodcastCategory[];
    stats: {
        total: number;
        published: number;
        drafts: number;
        total_plays: number;
    };
    filters: {
        status?: string;
        category?: string;
        search?: string;
    };
}

export default function PodcastIndex({ podcasts, categories, stats, filters }: Props) {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.podcasts.index'), { ...filters, search }, { preserveState: true });
    };

    const handleStatusFilter = (status: string) => {
        router.get(route('admin.podcasts.index'), {
            ...filters,
            status: status === 'all' ? undefined : status,
        }, { preserveState: true });
    };

    const handleCategoryFilter = (category: string) => {
        router.get(route('admin.podcasts.index'), {
            ...filters,
            category: category === 'all' ? undefined : category,
        }, { preserveState: true });
    };

    const togglePublished = (id: number) => {
        router.post(route('admin.podcasts.toggle-published', { id }), {}, { preserveState: true });
    };

    const toggleFeatured = (id: number) => {
        router.post(route('admin.podcasts.toggle-featured', { id }), {}, { preserveState: true });
    };

    const deletePodcast = (id: number) => {
        if (confirm('Are you sure you want to delete this podcast?')) {
            router.delete(route('admin.podcasts.destroy', { podcast: id }));
        }
    };

    const handleBulkAction = (action: string) => {
        if (selectedIds.length === 0) return;
        if (action === 'delete' && !confirm(`Delete ${selectedIds.length} podcast(s)?`)) return;

        router.post(route('admin.podcasts.bulk-action'), {
            action,
            ids: selectedIds,
        }, {
            onSuccess: () => setSelectedIds([]),
        });
    };

    const toggleSelectAll = () => {
        setSelectedIds(
            selectedIds.length === podcasts.data.length
                ? []
                : podcasts.data.map(p => p.id)
        );
    };

    const statusBadge = (podcast: PodcastItem) => {
        if (podcast.is_published) {
            return <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20">Published</Badge>;
        }
        if (podcast.published_at && new Date(podcast.published_at) > new Date()) {
            return <Badge variant="default" className="bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20">Scheduled</Badge>;
        }
        return <Badge variant="secondary">Draft</Badge>;
    };

    return (
        <AdminLayout title="Podcasts" breadcrumbs={[{ title: 'Podcasts', href: '/admin/podcasts' }]}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Podcast Manager</h1>
                        <p className="text-muted-foreground text-sm">Manage, publish, and track your podcast episodes.</p>
                    </div>
                    <Link href={route('admin.podcasts.create')}>
                        <Button className="gap-2">
                            <Plus className="size-4" /> New Episode
                        </Button>
                    </Link>
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Episodes', value: stats.total, icon: Mic, color: 'text-primary' },
                        { label: 'Published', value: stats.published, icon: Eye, color: 'text-green-500' },
                        { label: 'Drafts', value: stats.drafts, icon: Edit, color: 'text-amber-500' },
                        { label: 'Total Plays', value: stats.total_plays.toLocaleString(), icon: BarChart3, color: 'text-blue-500' },
                    ].map((stat) => (
                        <div key={stat.label} className="rounded-xl bg-card border border-border p-4">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                                    <stat.icon className="size-4" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                                    <p className="text-xl font-bold">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <Tabs value={filters.status || 'all'} onValueChange={handleStatusFilter}>
                        <TabsList>
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="published">Published</TabsTrigger>
                            <TabsTrigger value="draft">Drafts</TabsTrigger>
                            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className="flex items-center gap-3 flex-1 justify-end">
                        <form onSubmit={handleSearch} className="relative max-w-xs w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search episodes..."
                                className="pl-9"
                            />
                        </form>

                        <Select value={filters.category || 'all'} onValueChange={handleCategoryFilter}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Bulk actions */}
                {selectedIds.length > 0 && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                        <span className="text-sm font-medium">{selectedIds.length} selected</span>
                        <Button size="sm" variant="outline" onClick={() => handleBulkAction('publish')}>Publish</Button>
                        <Button size="sm" variant="outline" onClick={() => handleBulkAction('unpublish')}>Unpublish</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleBulkAction('delete')}>Delete</Button>
                    </div>
                )}

                {/* Table */}
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">
                                    <Checkbox
                                        checked={selectedIds.length === podcasts.data.length && podcasts.data.length > 0}
                                        onCheckedChange={toggleSelectAll}
                                    />
                                </TableHead>
                                <TableHead>Episode</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Plays</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {podcasts.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                                        <Mic className="size-10 mx-auto mb-3 opacity-30" />
                                        <p className="font-medium">No podcasts yet</p>
                                        <p className="text-sm mt-1">Upload your first episode to get started.</p>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                podcasts.data.map((podcast) => (
                                    <TableRow key={podcast.id} className="group">
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedIds.includes(podcast.id)}
                                                onCheckedChange={() => {
                                                    setSelectedIds(prev =>
                                                        prev.includes(podcast.id)
                                                            ? prev.filter(id => id !== podcast.id)
                                                            : [...prev, podcast.id]
                                                    );
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-lg bg-muted overflow-hidden shrink-0 flex items-center justify-center">
                                                    {podcast.thumbnail_url ? (
                                                        <img src={podcast.thumbnail_url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        podcast.media_type === 'video'
                                                            ? <Video className="size-4 text-primary/60" />
                                                            : <Headphones className="size-4 text-primary/60" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium truncate max-w-xs">{podcast.title}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {podcast.author?.name || 'Unknown'}
                                                        {podcast.is_featured && (
                                                            <Star className="size-3 inline ml-1 text-amber-400 fill-amber-400" />
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {podcast.category ? (
                                                <PodcastCategoryBadge category={podcast.category} size="sm" />
                                            ) : (
                                                <span className="text-xs text-muted-foreground">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell>{statusBadge(podcast)}</TableCell>
                                        <TableCell className="text-sm">{podcast.formatted_duration}</TableCell>
                                        <TableCell className="text-sm font-medium">{podcast.play_count.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="size-8">
                                                        <MoreVertical className="size-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={route('admin.podcasts.edit', { podcast: podcast.id })}>
                                                            <Edit className="size-4 mr-2" /> Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => togglePublished(podcast.id)}>
                                                        <Eye className="size-4 mr-2" />
                                                        {podcast.is_published ? 'Unpublish' : 'Publish'}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => toggleFeatured(podcast.id)}>
                                                        {podcast.is_featured ? (
                                                            <><StarOff className="size-4 mr-2" /> Unfeature</>
                                                        ) : (
                                                            <><Star className="size-4 mr-2" /> Feature</>
                                                        )}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <a href={`/podcasts/${podcast.slug}`} target="_blank" rel="noopener noreferrer">
                                                            <Play className="size-4 mr-2" /> View Public
                                                        </a>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => deletePodcast(podcast.id)}
                                                        className="text-destructive focus:text-destructive"
                                                    >
                                                        <Trash2 className="size-4 mr-2" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    {podcasts.last_page > 1 && (
                        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30">
                            <p className="text-sm text-muted-foreground">
                                Page {podcasts.current_page} of {podcasts.last_page} ({podcasts.total} total)
                            </p>
                            <div className="flex items-center gap-1">
                                {podcasts.links.map((link, i) => (
                                    <Button
                                        key={i}
                                        variant={link.active ? 'default' : 'outline'}
                                        size="sm"
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className="min-w-8"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
