import AdminLayout from '@/layouts/AdminLayout';
import { AdvancedDataTable } from '@/components/admin/AdvancedDataTable';
import { PaginatedData } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, CheckCircle, XCircle, Trash, Clock, User } from 'lucide-react';
import { router } from '@inertiajs/react';
import React from 'react';
import { toast } from 'sonner';

interface Review {
    id: number;
    rating: number;
    comment: string;
    status: 'pending' | 'approved' | 'rejected';
    reviewable_type: string;
    reviewable?: { name?: string; title?: string };
    user?: { name: string; avatar?: string };
    created_at: string;
}

interface Props {
    reviews: PaginatedData<Review>;
}

export default function Index({ reviews }: Props) {
    const handleAction = (id: number, action: 'approve' | 'reject') => {
        router.post(`/admin/reviews/${id}/${action}`, {}, {
            onSuccess: () => toast.success(`Review ${action}ed`),
        });
    };

    const columns = [
        {
            header: 'Target / Entity',
            cell: (item: Review) => (
                <div className="space-y-1">
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-40">
                        {item.reviewable_type.split('\\').pop()}
                    </div>
                    <div className="font-bold underline decoration-agency-accent/30 tracking-tight">
                        {item.reviewable?.name || item.reviewable?.title || 'Unknown Entity'}
                    </div>
                </div>
            ),
        },
        {
            header: 'User / Sentiment',
            cell: (item: Review) => (
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-agency-accent/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-agency-accent" />
                    </div>
                    <div>
                        <div className="text-xs font-black uppercase italic tracking-tighter">{item.user?.name || 'Anonymous'}</div>
                        <div className="flex gap-0.5 mt-0.5">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-2.5 w-2.5 ${i < item.rating ? 'fill-agency-accent text-agency-accent' : 'text-muted-foreground opacity-20'}`} />
                            ))}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            header: 'Status',
            cell: (item: Review) => (
                <Badge 
                    variant={item.status === 'approved' ? 'default' : item.status === 'rejected' ? 'destructive' : 'secondary'}
                    className="text-[10px] font-black uppercase italic tracking-tighter"
                >
                    {item.status}
                </Badge>
            ),
        },
        {
            header: 'Actions',
            cell: (item: Review) => (
                <div className="flex gap-2">
                    {item.status === 'pending' && (
                        <>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-500 hover:bg-emerald-50" onClick={() => handleAction(item.id, 'approve')}>
                                <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-agency-accent hover:bg-agency-accent/5" onClick={() => handleAction(item.id, 'reject')}>
                                <XCircle className="h-4 w-4" />
                            </Button>
                        </>
                    )}
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive opacity-40 hover:opacity-100" onClick={() => {
                        if(confirm('Delete Review?')) router.delete(`/admin/reviews/${item.id}`)
                    }}>
                        <Trash className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ];

    const renderGridItem = (item: Review) => (
        <Card className="border-agency-accent/10 group overflow-hidden">
            <CardContent className="p-4 space-y-4">
                <div className="flex justify-between items-start">
                    <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-3 w-3 ${i < item.rating ? 'fill-agency-accent text-agency-accent' : 'text-muted-foreground opacity-20'}`} />
                        ))}
                    </div>
                    <Badge variant={item.status === 'approved' ? 'default' : 'secondary'} className="text-[8px] h-4">
                        {item.status.toUpperCase()}
                    </Badge>
                </div>
                <p className="text-sm italic font-medium tracking-tight text-muted-foreground line-clamp-3">
                    &quot;{item.comment}&quot;
                </p>
                <div className="pt-4 border-t border-agency-accent/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-black/5 flex items-center justify-center">
                            <User className="h-3 w-3" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-tighter">{item.user?.name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] opacity-40 font-bold">
                        <Clock className="h-3 w-3" />
                        {new Date(item.created_at).toLocaleDateString()}
                    </div>
                </div>
                {item.status === 'pending' && (
                    <div className="grid grid-cols-2 gap-2 pt-2">
                        <Button size="sm" variant="outline" className="text-emerald-500 border-emerald-500/20 hover:bg-emerald-50 text-[10px] font-black uppercase italic" onClick={() => handleAction(item.id, 'approve')}>
                            Approve
                        </Button>
                        <Button size="sm" variant="outline" className="text-agency-accent border-agency-accent/20 hover:bg-agency-accent/5 text-[10px] font-black uppercase italic" onClick={() => handleAction(item.id, 'reject')}>
                            Reject
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );

    return (
        <AdminLayout title="Community Moderation">
            <div className="space-y-6">
                <div>
                    <h1 className="text-4xl font-black italic tracking-tighter uppercase">
                        Review <span className="text-agency-accent">Moderation</span>
                    </h1>
                    <p className="text-muted-foreground italic font-medium">Verify community sentiment and maintain data quality.</p>
                </div>

                <AdvancedDataTable
                    data={reviews.data}
                    columns={columns}
                    pagination={reviews}
                    renderGridItem={renderGridItem}
                    searchPlaceholder="Search reviews..."
                    routeKey="id"
                    baseUrl="/admin/reviews"
                    disableViewAction={true}
                    disableEditAction={true}
                    onSearch={(query) => router.get('/admin/reviews', { search: query }, { preserveState: true })}
                />
            </div>
        </AdminLayout>
    );
}
