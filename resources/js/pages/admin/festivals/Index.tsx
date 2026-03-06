import AdminLayout from '@/layouts/AdminLayout';
import { PaginatedData, Festival } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Map, Edit } from 'lucide-react';
import { router } from '@inertiajs/react';
import React from 'react';
import { AdvancedDataTable } from '@/components/admin/AdvancedDataTable';

interface Props {
    festivals: PaginatedData<Festival>;
    filters: {
        search?: string;
        category?: string;
        status?: string;
    };
}

export default function Index({ festivals, filters }: Props) {
    const breadcrumbs = [
        { title: 'Admin', href: '/admin' },
        { title: 'Festivals', href: '/admin/festivals' },
    ];

    const columns = [
        {
            header: 'ID',
            cell: (item: Festival) => (
                <span className="font-mono text-[10px] font-bold opacity-50">#{item.id}</span>
            ),
        },
        {
            header: 'Festival',
            cell: (item: Festival) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-agency-accent/10 flex items-center justify-center text-agency-accent">
                        <Map className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="font-bold uppercase tracking-tight text-sm">{item.name}</div>
                        <div className="text-[10px] opacity-60">
                            {typeof item.location === 'string' ? item.location : (item.location?.address || 'Location TBD')}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            header: 'Status',
            cell: (item: Festival) => (
                <Badge variant={item.is_published ? 'default' : 'secondary'} className="text-[10px] font-bold">
                    {item.is_published ? 'LIVE' : 'DRAFT'}
                </Badge>
            ),
        },
    ];

    const renderGridItem = (item: Festival) => (
        <Card key={item.id} className="border-agency-accent/10 overflow-hidden">
            <CardHeader className="p-4">
                <h3 className="font-bold uppercase tracking-tight">{item.name}</h3>
                <p className="text-[10px] opacity-60 italic">{typeof item.location === 'string' ? item.location : item.location?.address}</p>
            </CardHeader>
            <CardFooter className="p-4 pt-0 flex justify-between">
                <Button size="sm" variant="ghost" onClick={() => router.get(`/admin/festivals/${item.slug}/edit`)}>
                    <Edit className="h-3 w-3 mr-2" /> Edit
                </Button>
            </CardFooter>
        </Card>
    );

    return (
        <AdminLayout title="Festivals" breadcrumbs={breadcrumbs}>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-black italic uppercase">Festivals</h1>
                    <Button onClick={() => router.get('/admin/festivals/create')} className="bg-agency-accent">
                        Register Festival
                    </Button>
                </div>

                {festivals && festivals.data && (
                    <AdvancedDataTable
                        data={festivals.data}
                        columns={columns}
                        pagination={festivals}
                        renderGridItem={renderGridItem}
                        searchPlaceholder="Search radar..."
                        baseUrl="/admin/festivals"
                        onSearch={(q) => router.get('/admin/festivals', { ...filters, search: q }, { preserveState: true })}
                    />
                )}
            </div>
        </AdminLayout>
    );
}
