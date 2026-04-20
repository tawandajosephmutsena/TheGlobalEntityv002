import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
    Calendar, 
    Plus, 
    CheckCircle2, 
    Clock, 
    MessageSquare,
    ArrowUpRight,
    Edit
} from 'lucide-react';

interface Festival {
    id: number;
    name: string;
    slug: string;
    is_published: boolean;
    created_at: string;
    category?: { name: string };
}

interface DashboardProps {
    festivals: {
        data: Festival[];
        links: any;
    };
    stats: {
        total_festivals: number;
        published_festivals: number;
        recent_reviews: number;
    };
}

export default function OrganizerDashboard({ festivals, stats }: DashboardProps) {
    return (
        <AdminLayout title="Organizer Dashboard" breadcrumbs={[{ title: 'Dashboard', href: '/organizer/dashboard' }]}>
            <Head title="Organizer Dashboard" />
            
            <div className="space-y-8 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
                        <p className="text-muted-foreground">Manage your festivals and track your performance.</p>
                    </div>
                    <Link href="/admin/festivals/create">
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Create Festival
                        </Button>
                    </Link>
                </div>

                {/* Stats Overview */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Festivals</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_festivals}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Published</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.published_festivals}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Recent Reviews</CardTitle>
                            <MessageSquare className="h-4 w-4 text-agency-accent" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.recent_reviews}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Festivals Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Your Festivals</CardTitle>
                        <CardDescription>A list of festivals you have created.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Festival Name</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {festivals.data.length > 0 ? festivals.data.map((festival) => (
                                    <TableRow key={festival.id}>
                                        <TableCell className="font-medium">{festival.name}</TableCell>
                                        <TableCell>
                                            <Badge variant={festival.is_published ? "default" : "secondary"}>
                                                {festival.is_published ? 'Published' : 'Draft'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{festival.category?.name || 'N/A'}</TableCell>
                                        <TableCell>{new Date(festival.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/festivals/${festival.id}/edit`}>
                                                    <Button variant="ghost" size="icon">
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={`/festivals/${festival.slug}`} target="_blank">
                                                    <Button variant="ghost" size="icon">
                                                        <ArrowUpRight className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                            No festivals found. Create your first festival to get started!
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
