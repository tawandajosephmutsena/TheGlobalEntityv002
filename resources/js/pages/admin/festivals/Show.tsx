import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, router } from '@inertiajs/react';
import { 
    ArrowLeft, 
    Calendar, 
    MapPin, 
    User, 
    Edit, 
    Trash2, 
    Globe, 
    Clock, 
    Star, 
    Activity as ActivityIcon,
    AlertCircle
} from 'lucide-react';
import React from 'react';
import { Festival, Review, Activity } from '@/types';

interface Props {
    festival: Festival;
}

export default function Show({ festival }: Props) {
    const breadcrumbs = [
        { title: 'Admin', href: '/admin' },
        { title: 'Festivals', href: '/admin/festivals' },
        { title: festival.name, href: `/admin/festivals/${festival.id}` },
    ];

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this festival?')) {
            router.delete(`/admin/festivals/${festival.id}`);
        }
    };

    const locationAddress = typeof festival.location === 'string' 
        ? festival.location 
        : (festival.location?.address || 'Location TBD');

    return (
        <AdminLayout title={festival.name} breadcrumbs={breadcrumbs}>
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/festivals">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-black italic uppercase tracking-tighter text-agency-accent">
                                    {festival.name}
                                </h1>
                                <Badge variant={festival.is_published ? 'default' : 'secondary'} className="text-[10px] font-bold">
                                    {festival.is_published ? 'LIVE' : 'DRAFT'}
                                </Badge>
                                <span className="font-mono text-[10px] font-bold opacity-30 tracking-widest">
                                    SIGNAL ID: #{festival.id}
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                <MapPin className="h-3 w-3" /> {locationAddress}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => router.get(`/admin/festivals/${festival.id}/edit`)}
                        >
                            <Edit className="h-4 w-4 mr-2" /> Edit
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive hover:bg-destructive/10"
                            onClick={handleDelete}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Primary Info */}
                    <Card className="md:col-span-2 border-agency-accent/10 bg-agency-primary/5">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold uppercase tracking-widest opacity-50 flex items-center gap-2">
                                <Calendar className="h-4 w-4" /> Timeline & Origin
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <p className="text-[10px] font-bold uppercase opacity-40 mb-1">Start Date</p>
                                    <p className="text-xl font-black italic">
                                        {new Date(festival.start_date).toLocaleDateString(undefined, { 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase opacity-40 mb-1">End Date</p>
                                    <p className="text-xl font-black italic">
                                        {festival.end_date ? new Date(festival.end_date).toLocaleDateString(undefined, { 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        }) : 'Ongoing / TBD'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase opacity-40 mb-1">Designated Agent</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="w-8 h-8 rounded-full bg-agency-accent/20 flex items-center justify-center">
                                            <User className="h-4 w-4 text-agency-accent" />
                                        </div>
                                        <p className="font-bold">{festival.author?.name || 'Unassigned'}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase opacity-40 mb-1">Category</p>
                                    <Badge variant="outline" className="mt-1 border-agency-accent/30 text-agency-accent">
                                        {festival.category?.name || 'Unclassified'}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Social/Tags */}
                    <Card className="border-agency-accent/10 bg-agency-primary/5">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold uppercase tracking-widest opacity-50 flex items-center gap-2">
                                <Globe className="h-4 w-4" /> Social Radar
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {festival.social_tags && festival.social_tags.length > 0 ? (
                                    festival.social_tags.map((tag, idx) => (
                                        <Badge key={idx} variant="secondary" className="bg-agency-accent/10 text-agency-accent border-none font-bold italic">
                                            #{tag}
                                        </Badge>
                                    ))
                                ) : (
                                    <p className="text-xs italic opacity-50">No social tags detected.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sub-sections Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Activities Radar */}
                    <Card className="border-agency-accent/10">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-black uppercase italic flex items-center gap-2">
                                <ActivityIcon className="h-5 w-5 text-agency-accent" /> Activities Radar
                            </CardTitle>
                            <Button size="sm" variant="outline" className="text-[10px] h-7">Add Activity</Button>
                        </CardHeader>
                        <CardContent>
                            {festival.activities && festival.activities.length > 0 ? (
                                <div className="space-y-4">
                                    {festival.activities.map((activity: Activity) => (
                                        <div key={activity.id} className="p-4 rounded-lg bg-muted/30 border border-muted flex justify-between items-center group hover:border-agency-accent/30 transition-colors">
                                            <div>
                                                <p className="font-bold uppercase tracking-tighter">{activity.name}</p>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-agency-accent/10 text-agency-accent font-bold">
                                                        {activity.category}
                                                    </span>
                                                    <span className="text-[10px] opacity-50 flex items-center gap-1">
                                                        <Clock className="h-3 w-3" /> 
                                                        {new Date(activity.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                            <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 opacity-40 italic">
                                    <AlertCircle className="h-10 w-10" />
                                    <p>No signal on the activities radar.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Community Reviews */}
                    <Card className="border-agency-accent/10">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-black uppercase italic flex items-center gap-2">
                                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" /> Community Reviews
                            </CardTitle>
                            <Badge className="bg-yellow-500/10 text-yellow-600 border-none font-bold">
                                {festival.reviews?.length || 0} TOTAL
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            {festival.reviews && festival.reviews.length > 0 ? (
                                <div className="space-y-4">
                                    {festival.reviews.map((review: Review) => (
                                        <div key={review.id} className="p-4 rounded-lg border border-muted bg-muted/10">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-agency-accent/20 flex items-center justify-center">
                                                        <User className="h-3 w-3 text-agency-accent" />
                                                    </div>
                                                    <p className="text-xs font-bold">{review.user?.name || 'Guardian Member'}</p>
                                                </div>
                                                <div className="flex gap-0.5 text-yellow-500">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-current' : 'opacity-20'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-sm leading-relaxed opacity-80 italic italic">"{review.comment}"</p>
                                            <p className="text-[10px] opacity-40 mt-3 flex items-center gap-1 uppercase font-bold tracking-widest">
                                                <Clock className="h-3 w-3" /> {new Date(review.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 opacity-40 italic">
                                    <Star className="h-10 w-10" />
                                    <p>No transmissions from the community yet.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
