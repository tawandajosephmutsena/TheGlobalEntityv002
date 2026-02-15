import AdminLayout from '@/layouts/AdminLayout';
import { AdvancedDataTable } from '@/components/admin/AdvancedDataTable';
import { Service, PaginatedData, Category } from '@/types';
import { Badge } from '@/components/ui/badge';
import { router } from '@inertiajs/react';
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


interface Props {
    services: PaginatedData<Service>;
    categories: Category[];
    filters: {
        search?: string;
        category?: string;
        status?: string;
    };
}


export default function Index({ services, categories, filters }: Props) {

    const breadcrumbs = [
        { title: 'Admin', href: '/admin' },
        { title: 'Services', href: '/admin/services' },
    ];

    const columns = [
        {
            header: 'Service',
            cell: (item: Service) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-muted overflow-hidden flex-shrink-0">
                        {item.featured_image ? (
                            <img src={item.featured_image} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground p-2">
                                <Badge variant="outline" className="text-[8px]">{item.icon || 'SVC'}</Badge>
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-xs text-muted-foreground">{item.price_range || 'Contact for pricing'}</div>
                    </div>
                </div>
            ),
        },
        {
            header: 'Category',
            cell: (item: Service) => (
                <Badge variant="outline" className="text-[10px] capitalize">
                    {item.category?.name || 'Uncategorized'}
                </Badge>
            ),
        },
        {
            header: 'Status',

            cell: (item: Service) => (
                <div className="flex gap-2">
                    <Badge variant={item.is_published ? 'default' : 'secondary'}>
                        {item.is_published ? 'Published' : 'Draft'}
                    </Badge>
                    {item.is_featured && (
                        <Badge variant="outline" className="border-agency-accent text-agency-accent">
                            Featured
                        </Badge>
                    )}
                </div>
            ),
        },
        {
            header: 'Order',
            cell: (item: Service) => (
                <span className="text-sm font-mono">{item.sort_order}</span>
            ),
        },
    ];

    const renderGridItem = (item: Service) => (
        <div 
            key={item.id}
            className="group relative bg-card rounded-xl border border-agency-primary/10 overflow-hidden hover:border-agency-accent/50 transition-all cursor-pointer h-full flex flex-col"
            onClick={() => router.get(`/admin/services/${item.slug}/edit`)}
        >
            <div className="aspect-[16/9] bg-muted relative overflow-hidden">
                {item.featured_image ? (
                    <img src={item.featured_image} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground opacity-20">
                         {/* Icon placeholder */}
                    </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                    <Badge variant={item.is_published ? 'default' : 'secondary'} className="text-[10px] uppercase font-bold px-1.5 h-5">
                       {item.is_published ? 'PUB' : 'DFT'}
                    </Badge>
                </div>
            </div>
            
            <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-sm mb-1 group-hover:text-agency-accent transition-colors">{item.title}</h3>
                <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-[8px] h-4 px-1 capitalize">
                        {item.category?.name || 'Uncategorized'}
                    </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{item.description}</p>

                <div className="mt-auto pt-3 border-t border-agency-primary/5 flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-agency-accent">{item.price_range || 'Custom'}</span>
                    <div className="flex items-center gap-1.5 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                        {/* Actions */}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <AdminLayout title="Services Management" breadcrumbs={breadcrumbs}>
            <div className="space-y-6">
                 <div>
                    <h1 className="text-3xl font-bold tracking-tight">Services</h1>
                    <p className="text-muted-foreground">Manage your agency offerings and pricing</p>
                </div>

                <div className="flex items-center gap-4 bg-muted/20 p-4 rounded-xl">
                    <div className="flex-1 max-w-sm">
                        <Select 
                            value={filters.category || 'all'} 
                            onValueChange={(val) => router.get('/admin/services', { ...filters, category: val === 'all' ? undefined : val }, { preserveState: true })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map(cat => (
                                    <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>


                <AdvancedDataTable
                    data={services.data}
                    columns={columns}
                    pagination={services}
                    renderGridItem={renderGridItem}
                    createUrl="/admin/services/create"
                    createLabel="Add Service"
                    searchPlaceholder="Search services..."
                    routeKey="slug"
                    onSearch={(query) => router.get('/admin/services', { ...filters, search: query }, { preserveState: true })}
                />

            </div>
        </AdminLayout>
    );
}
