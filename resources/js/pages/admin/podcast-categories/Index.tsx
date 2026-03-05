import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Folder, Loader2 } from 'lucide-react';

declare function route(name: string, params?: unknown, absolute?: boolean): string;

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    color: string;
    icon: string | null;
    sort_order: number;
    is_active: boolean;
    podcasts_count: number;
}

interface Props {
    categories: {
        data: Category[];
        current_page: number;
        last_page: number;
        total: number;
    };
}

function CategoryForm({
    initial,
    onSubmit,
    isLoading,
}: {
    initial?: Partial<Category>;
    onSubmit: (data: Record<string, string | number | boolean>) => void;
    isLoading: boolean;
}) {
    const [form, setForm] = useState({
        name: initial?.name || '',
        description: initial?.description || '',
        color: initial?.color || '#7f13ec',
        icon: initial?.icon || '',
        sort_order: initial?.sort_order ?? 0,
        is_active: initial?.is_active ?? true,
    });

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                    value={form.name}
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Technology"
                />
            </div>
            <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                    value={form.description}
                    onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Color</Label>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={form.color}
                            onChange={(e) => setForm(prev => ({ ...prev, color: e.target.value }))}
                            className="size-8 rounded border border-border cursor-pointer"
                            title="Category color"
                            aria-label="Category color"
                        />
                        <Input
                            value={form.color}
                            onChange={(e) => setForm(prev => ({ ...prev, color: e.target.value }))}
                            className="text-xs flex-1"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Sort Order</Label>
                    <Input
                        type="number"
                        value={form.sort_order}
                        onChange={(e) => setForm(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                    />
                </div>
            </div>
            <div className="flex items-center justify-between">
                <Label>Active</Label>
                <Switch
                    checked={form.is_active}
                    onCheckedChange={(v) => setForm(prev => ({ ...prev, is_active: v }))}
                />
            </div>
            <Button onClick={() => onSubmit(form)} disabled={isLoading || !form.name} className="w-full gap-2">
                {isLoading ? <Loader2 className="size-4 animate-spin" /> : null}
                {initial ? 'Update Category' : 'Create Category'}
            </Button>
        </div>
    );
}

export default function PodcastCategoriesIndex({ categories }: Props) {
    const [editId, setEditId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const handleCreate = (data: Record<string, string | number | boolean>) => {
        setIsLoading(true);
        router.post(route('admin.podcast-categories.store'), data as Record<string, string>, {
            onSuccess: () => { setIsCreateOpen(false); setIsLoading(false); },
            onError: () => setIsLoading(false),
        });
    };

    const handleUpdate = (id: number, data: Record<string, string | number | boolean>) => {
        setIsLoading(true);
        router.put(route('admin.podcast-categories.update', { podcast_category: id }), data as Record<string, string>, {
            onSuccess: () => { setEditId(null); setIsLoading(false); },
            onError: () => setIsLoading(false),
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Delete this category? Podcasts in it will become uncategorized.')) {
            router.delete(route('admin.podcast-categories.destroy', { podcast_category: id }));
        }
    };

    return (
        <AdminLayout title="Podcast Categories" breadcrumbs={[
            { title: 'Podcasts', href: '/admin/podcasts' },
            { title: 'Categories', href: '/admin/podcast-categories' },
        ]}>
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
                        <p className="text-muted-foreground text-sm">Organize your podcast episodes by topic.</p>
                    </div>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2"><Plus className="size-4" /> New Category</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create Category</DialogTitle>
                            </DialogHeader>
                            <CategoryForm onSubmit={handleCreate} isLoading={isLoading} />
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="rounded-xl border border-border bg-card overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Category</TableHead>
                                <TableHead>Episodes</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                                        <Folder className="size-10 mx-auto mb-3 opacity-30" />
                                        <p className="font-medium">No categories yet</p>
                                        <p className="text-sm mt-1">Create your first category to organize episodes.</p>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                categories.data.map((cat) => (
                                    <TableRow key={cat.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="size-3 rounded-full shrink-0"
                                                    style={{ backgroundColor: cat.color }}
                                                />
                                                <div>
                                                    <p className="font-medium">{cat.name}</p>
                                                    {cat.description && (
                                                        <p className="text-xs text-muted-foreground line-clamp-1 max-w-xs">{cat.description}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm">{cat.podcasts_count}</TableCell>
                                        <TableCell>
                                            <span className={`text-xs font-bold ${cat.is_active ? 'text-green-600' : 'text-muted-foreground'}`}>
                                                {cat.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Dialog
                                                    open={editId === cat.id}
                                                    onOpenChange={(open) => setEditId(open ? cat.id : null)}
                                                >
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="size-8">
                                                            <Edit className="size-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Edit Category</DialogTitle>
                                                        </DialogHeader>
                                                        <CategoryForm
                                                            initial={cat}
                                                            onSubmit={(data) => handleUpdate(cat.id, data)}
                                                            isLoading={isLoading}
                                                        />
                                                    </DialogContent>
                                                </Dialog>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-8 text-destructive hover:text-destructive"
                                                    onClick={() => handleDelete(cat.id)}
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AdminLayout>
    );
}
