import AdminLayout from '@/layouts/AdminLayout';
import { AdvancedDataTable } from '@/components/admin/AdvancedDataTable';
import { Category, PaginatedData } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Edit, Trash, Plus } from 'lucide-react';
import { router, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface Props {
    categories: PaginatedData<Category>;
    filters: {
        search?: string;
        type?: string;
    };
    stats: {
        total: number;
        insights: number;
        services: number;
        portfolio: number;
    };
}

export default function Index({ categories, filters, stats }: Props) {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const breadcrumbs = [
        { title: 'Admin', href: '/admin' },
        { title: 'Categories', href: '/admin/categories' },
    ];

    const columns = [
        {
            header: 'Name',
            cell: (item: Category) => (
                <div>
                    <div className="font-bold">{item.name}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">{item.slug}</div>
                </div>
            ),
        },
        {
            header: 'Type',
            cell: (item: Category) => (
                <Badge variant="outline" className="capitalize">
                    {item.type}
                </Badge>
            ),
        },
        {
            header: 'Description',
            cell: (item: Category) => (
                <div className="text-xs text-muted-foreground max-w-md truncate">
                    {item.description || 'No description'}
                </div>
            ),
        },
    ];

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        slug: '',
        description: '',
        type: 'insight' as Category['type'],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCategory) {
            put(route('admin.categories.update', editingCategory.slug), {
                onSuccess: () => {
                    setIsAddDialogOpen(false);
                    setEditingCategory(null);
                    reset();
                    toast.success('Category updated successfully');
                },
            });
        } else {
            post(route('admin.categories.store'), {
                onSuccess: () => {
                    setIsAddDialogOpen(false);
                    reset();
                    toast.success('Category created successfully');
                },
            });
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setData({
            name: category.name,
            slug: category.slug,
            description: category.description || '',
            type: category.type,
        });
        setIsAddDialogOpen(true);
    };

    const handleDelete = (category: Category) => {
        if (confirm('Are you sure you want to delete this category?')) {
            router.delete(route('admin.categories.destroy', category.slug), {
                onSuccess: () => toast.success('Category deleted successfully'),
                onError: (errors: any) => {
                    if (errors.error) toast.error(errors.error);
                }
            });
        }
    };

    return (
        <AdminLayout title="Category Management" breadcrumbs={breadcrumbs}>
            <div className="space-y-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                        <p className="text-muted-foreground">Manage categories for Insights, Services, and Portfolio</p>
                    </div>

                    <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
                        setIsAddDialogOpen(open);
                        if (!open) {
                            setEditingCategory(null);
                            reset();
                        }
                    }}>
                        <DialogTrigger asChild>
                            <Button className="bg-agency-accent text-white hover:bg-agency-accent/90 shadow-lg gap-2">
                                <Plus className="h-4 w-4" /> Add Category
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editingCategory ? 'Edit Category' : 'Create New Category'}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="type">Type</Label>
                                    <Select 
                                        value={data.type} 
                                        onValueChange={(val) => setData('type', val as any)}
                                        disabled={!!editingCategory}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="insight">Insight</SelectItem>
                                            <SelectItem value="service">Service</SelectItem>
                                            <SelectItem value="portfolio">Portfolio</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.type && <p className="text-xs text-destructive">{errors.type}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input 
                                        id="name" 
                                        value={data.name} 
                                        onChange={e => setData('name', e.target.value)} 
                                        placeholder="Category Name"
                                    />
                                    {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                                </div>
                                {editingCategory && (
                                    <div className="space-y-2">
                                        <Label htmlFor="slug">Slug</Label>
                                        <Input 
                                            id="slug" 
                                            value={data.slug} 
                                            onChange={e => setData('slug', e.target.value)} 
                                        />
                                        {errors.slug && <p className="text-xs text-destructive">{errors.slug}</p>}
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea 
                                        id="description" 
                                        value={data.description} 
                                        onChange={e => setData('description', e.target.value)} 
                                        placeholder="Optional description"
                                    />
                                    {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={processing} className="bg-agency-accent text-white hover:bg-agency-accent/90 shadow-lg">
                                        {editingCategory ? 'Update' : 'Create'} Category
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="p-4 bg-muted/10">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total</div>
                        <div className="text-2xl font-black">{stats.total}</div>
                    </Card>
                    <Card className="p-4 bg-primary/5 border-primary/20">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-primary">Insights</div>
                        <div className="text-2xl font-black">{stats.insights}</div>
                    </Card>
                    <Card className="p-4 bg-orange-500/5 border-orange-500/20">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-orange-500">Services</div>
                        <div className="text-2xl font-black">{stats.services}</div>
                    </Card>
                    <Card className="p-4 bg-blue-500/5 border-blue-500/20">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-blue-500">Portfolio</div>
                        <div className="text-2xl font-black">{stats.portfolio}</div>
                    </Card>
                </div>

                <AdvancedDataTable
                    data={categories.data}
                    columns={[
                        ...columns,
                        {
                            header: 'Actions',
                            cell: (item: Category) => (
                                <div className="flex gap-2">
                                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleEdit(item)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleDelete(item)}>
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            ),
                        }
                    ]}
                    pagination={categories}
                    searchPlaceholder="Search categories..."
                    onSearch={(query) => router.get('/admin/categories', { ...filters, search: query }, { preserveState: true })}
                />
            </div>
        </AdminLayout>
    );
}

function Card({ children, className }: { children: React.ReactNode, className?: string }) {
    return <div className={`border rounded-2xl p-4 bg-card ${className}`}>{children}</div>;
}

// Mock route helper if not globally available
function route(name: string, params?: any) {
    if (name === 'admin.categories.store') return '/admin/categories';
    if (name === 'admin.categories.update') return `/admin/categories/${params}`;
    if (name === 'admin.categories.destroy') return `/admin/categories/${params}`;
    return '#';
}
