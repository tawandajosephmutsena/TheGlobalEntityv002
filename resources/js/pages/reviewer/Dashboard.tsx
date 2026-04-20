import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
    Activity,
    Star,
    MessageSquare,
    Eye,
    TrendingUp,
    FileText,
    ArrowUpRight
} from 'lucide-react';

interface Review {
    id: number;
    rating: number;
    comment: string;
    created_at: string;
    user: { name: string };
    festival: { name: string; slug: string };
}

interface DashboardProps {
    reviews: {
        data: Review[];
        links: any;
    };
    stats: {
        total_global_reviews: number;
        total_festivals: number;
        pending_audit: number;
    };
}

export default function ReviewerDashboard({ reviews, stats }: DashboardProps) {
    return (
        <AdminLayout title="Reviewer Dashboard" breadcrumbs={[{ title: 'Dashboard', href: '/reviewer/dashboard' }]}>
            <Head title="Reviewer Dashboard" />
            
            <div className="space-y-8 p-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Reviewer Overview</h1>
                    <p className="text-muted-foreground">Monitor platform feedback and festival ratings.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Global Reviews</CardTitle>
                            <Star className="h-4 w-4 text-agency-accent" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_global_reviews}</div>
                            <p className="text-xs text-muted-foreground">Total feedback entries</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Festivals</CardTitle>
                            <Activity className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_festivals}</div>
                            <p className="text-xs text-muted-foreground">Festivals open for review</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Audit Pipeline</CardTitle>
                            <FileText className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pending_audit}</div>
                            <p className="text-xs text-muted-foreground">Items needing attention</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Reviews Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Platform Feedback</CardTitle>
                        <CardDescription>Monitor the latest user reviews across all festivals.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Festival</TableHead>
                                    <TableHead>Rating</TableHead>
                                    <TableHead className="max-w-[300px]">Comment</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reviews.data.map((review) => (
                                    <TableRow key={review.id}>
                                        <TableCell className="font-medium">{review.user.name}</TableCell>
                                        <TableCell>{review.festival.name}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-3 h-3 fill-agency-accent text-agency-accent" />
                                                <span>{review.rating}/5</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-[300px] truncate italic text-muted-foreground">
                                            "{review.comment}"
                                        </TableCell>
                                        <TableCell>{new Date(review.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/festivals/${review.festival.slug}`} target="_blank">
                                                <Button variant="ghost" size="sm" className="gap-1">
                                                    View
                                                    <ArrowUpRight className="w-3 h-3" />
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
