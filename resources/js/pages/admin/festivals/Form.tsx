import AdminLayout from '@/layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, ArrowLeft, Plus, X, Globe, MapPin, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { Category } from '@/types';

interface Festival {
    id?: number;
    name: string;
    slug: string;
    location: any;
    start_date: string;
    end_date: string;
    social_tags: string[];
    is_published: boolean;
    category_id?: number | string;
}

interface Props {
    festival?: Festival;
    categories: Category[];
    authors: { id: number; name: string }[];
}

export default function FestivalForm({ festival, categories, authors }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: festival?.name || '',
        slug: festival?.slug || '',
        location: typeof festival?.location === 'string' ? { address: festival.location } : (festival?.location || { address: '', lat: 0, lng: 0 }),
        start_date: festival?.start_date ? new Date(festival.start_date).toISOString().split('T')[0] : '',
        end_date: festival?.end_date ? new Date(festival.end_date).toISOString().split('T')[0] : '',
        social_tags: festival?.social_tags || [],
        is_published: festival?.is_published ?? false,
        category_id: festival?.category_id?.toString() || '',
        author_id: festival?.author_id?.toString() || '',
    });

    const [newTag, setNewTag] = React.useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const options = {
            onSuccess: () => toast.success(festival ? 'Festival updated!' : 'Festival registered!'),
            onError: () => toast.error('Check constraints.'),
        };
        
        if (festival?.id) {
            put(`/admin/festivals/${festival.id}`, options);
        } else {
            post('/admin/festivals', options);
        }
    };

    const addTag = () => {
        if (newTag && !data.social_tags.includes(newTag)) {
            setData('social_tags', [...data.social_tags, newTag]);
            setNewTag('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/festivals">
                        <Button variant="ghost" size="icon" type="button">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-4xl font-black italic tracking-tighter uppercase">
                        {festival ? 'Update' : 'Register'} <span className="text-agency-accent">Festival</span>
                    </h1>
                </div>
                <Button type="submit" disabled={processing} className="bg-agency-accent text-white font-black italic uppercase">
                    <Save className="h-4 w-4 mr-2" />
                    {festival ? 'Commit Changes' : 'Initialize Radar'}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-agency-accent/10">
                        <CardHeader>
                            <CardTitle className="uppercase font-black italic tracking-tight">Core Metadata</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="uppercase font-bold text-xs opacity-60">Festival Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="italic font-bold"
                                />
                                {errors.name && <p className="text-xs text-destructive font-bold">{errors.name}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="slug" className="uppercase font-bold text-xs opacity-60">System Slug</Label>
                                <Input
                                    id="slug"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    placeholder="tomorrowland-2026"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label className="uppercase font-bold text-xs opacity-60">Category Classification</Label>
                                <Select value={data.category_id || '_none_'} onValueChange={(val) => setData('category_id', val === '_none_' ? '' : val)}>
                                    <SelectTrigger className="border-agency-accent/20">
                                        <SelectValue placeholder="Select Intelligence Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="_none_">Unclassified</SelectItem>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label className="uppercase font-bold text-xs opacity-60">Designated Agent / Author</Label>
                                <Select value={data.author_id || '_none_'} onValueChange={(val) => setData('author_id', val === '_none_' ? '' : val)}>
                                    <SelectTrigger className="border-agency-accent/20">
                                        <SelectValue placeholder="Assign Intelligence Agent" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="_none_">Unassigned</SelectItem>
                                        {authors.map((auth) => (
                                            <SelectItem key={auth.id} value={auth.id.toString()}>{auth.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-agency-accent/10">
                        <CardHeader>
                            <CardTitle className="uppercase font-black italic tracking-tight">Geospatial Data</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label className="uppercase font-bold text-xs opacity-60">Physical Address / Region</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-4 w-4 opacity-40" />
                                    <Input
                                        value={data.location.address}
                                        onChange={(e) => setData('location', { ...data.location, address: e.target.value })}
                                        className="pl-10"
                                        placeholder="Boom, Belgium"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label className="uppercase font-bold text-xs opacity-60">Latitude</Label>
                                    <Input
                                        type="number"
                                        step="any"
                                        value={data.location.lat}
                                        onChange={(e) => setData('location', { ...data.location, lat: parseFloat(e.target.value) })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label className="uppercase font-bold text-xs opacity-60">Longitude</Label>
                                    <Input
                                        type="number"
                                        step="any"
                                        value={data.location.lng}
                                        onChange={(e) => setData('location', { ...data.location, lng: parseFloat(e.target.value) })}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="border-agency-accent/20 bg-agency-accent/5">
                        <CardHeader>
                            <CardTitle className="uppercase font-black italic tracking-tight text-agency-accent">Radar Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="font-bold uppercase text-xs">Broadcast Live</Label>
                                    <p className="text-[10px] text-muted-foreground italic">Visible to public radar</p>
                                </div>
                                <Switch
                                    checked={data.is_published}
                                    onCheckedChange={(checked) => setData('is_published', checked)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-agency-accent/10">
                        <CardHeader>
                            <CardTitle className="uppercase font-black italic tracking-tight">Temporal Range</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label className="uppercase font-bold text-xs opacity-60">Start Point</Label>
                                <Input
                                    type="date"
                                    value={data.start_date}
                                    onChange={(e) => setData('start_date', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label className="uppercase font-bold text-xs opacity-60">End Point</Label>
                                <Input
                                    type="date"
                                    value={data.end_date}
                                    onChange={(e) => setData('end_date', e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-agency-accent/10">
                        <CardHeader>
                            <CardTitle className="uppercase font-black italic tracking-tight">Social Signals</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    placeholder="#hashtag"
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                />
                                <Button type="button" size="icon" onClick={addTag} variant="outline">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {data.social_tags.map((tag, i) => (
                                    <Badge key={i} variant="secondary" className="pl-2 gap-1 bg-agency-accent/10 text-agency-accent border-agency-accent/20">
                                        {tag}
                                        <X
                                            className="h-3 w-3 cursor-pointer"
                                            onClick={() => setData('social_tags', data.social_tags.filter(t => t !== tag))}
                                        />
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}
