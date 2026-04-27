import { useForm, Link, usePage } from '@inertiajs/react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, ArrowLeft, Plus, X, MapPin, ImagePlus, GripVertical, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Category, MediaAsset } from '@/types';
import MediaLibrary from '@/components/admin/MediaLibrary';

interface Festival {
    id?: number;
    name: string;
    description: string;
    slug: string;
    type: string;
    location: any;
    start_date: string;
    end_date: string;
    social_tags: string[];
    is_published: boolean;
    is_featured: boolean;
    image: string;
    gallery: string[];
    category_id?: number | string;
    author_id?: number | string;
}

interface Props {
    festival?: Festival;
    categories: Category[];
    authors: { id: number; name: string }[];
}

export default function FestivalForm({ festival, categories, authors }: Props) {
    const { auth } = usePage<any>().props;
    const user = auth?.user;

    const { data, setData, post, put, processing, errors } = useForm({
        name: festival?.name || '',
        description: festival?.description || '',
        slug: festival?.slug || '',
        type: festival?.type || '',
        location: typeof festival?.location === 'string' ? { address: festival.location } : (festival?.location || { address: '', lat: 0, lng: 0 }),
        start_date: festival?.start_date ? new Date(festival.start_date).toISOString().split('T')[0] : '',
        end_date: festival?.end_date ? new Date(festival.end_date).toISOString().split('T')[0] : '',
        social_tags: festival?.social_tags || [],
        is_published: festival?.is_published ?? false,
        is_featured: festival?.is_featured ?? false,
        image: festival?.image || '',
        gallery: festival?.gallery || [],
        category_id: festival?.category_id?.toString() || '',
        author_id: festival?.author_id?.toString() || user?.id?.toString() || '',
    });

    const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
    const [newTag, setNewTag] = React.useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Final date validation check
        if (data.start_date && data.end_date && new Date(data.start_date) > new Date(data.end_date)) {
            toast.error('The radar timeline is corrupted. End date must be after start date.');
            return;
        }

        const options = {
            onSuccess: () => toast.success(festival ? 'Festival signal updated!' : 'Festival radar initialized!'),
            onError: (err: any) => {
                console.error(err);
                toast.error('Signal transmission failed. Check constraints.');
            },
        };
        
        if (festival?.id) {
            put(`/admin/festivals/${festival.id}`, options);
        } else {
            post('/admin/festivals', options);
        }
    };

    const addGalleryImages = (assets: MediaAsset | MediaAsset[]) => {
        const newImages = Array.isArray(assets) 
            ? assets.map(a => a.url) 
            : [assets.url];
        
        // Filter out duplicates
        const uniqueNewImages = newImages.filter(url => !data.gallery.includes(url));
        setData('gallery', [...data.gallery, ...uniqueNewImages]);
    };

    const removeGalleryImage = (url: string) => {
        setData('gallery', data.gallery.filter((img: string) => img !== url));
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
                <div className="flex items-center gap-3">
                    <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        className="gap-2 border-agency-accent/20"
                    >
                        {isSidebarCollapsed ? <PanelRightOpen className="h-4 w-4" /> : <PanelRightClose className="h-4 w-4" />}
                        <span className="hidden sm:inline">{isSidebarCollapsed ? 'Expand Radar' : 'Collapse Radar'}</span>
                    </Button>
                    <Button type="submit" disabled={processing} className="bg-agency-accent text-white font-black italic uppercase">
                        <Save className="h-4 w-4 mr-2" />
                        {festival ? 'Commit Changes' : 'Initialize Radar'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className={cn(
                    "space-y-6 transition-all duration-300",
                    isSidebarCollapsed ? "lg:col-span-12" : "lg:col-span-9"
                )}>
                    <Card className="border-agency-accent/10">
                        <CardHeader>
                            <CardTitle className="uppercase font-black italic tracking-tight">Core Metadata</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name" className="uppercase font-bold text-xs opacity-60">Festival Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="italic font-bold"
                                        placeholder="Tomorrowland 2026"
                                    />
                                    {errors.name && <p className="text-xs text-destructive font-bold">{errors.name}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="type" className="uppercase font-bold text-xs opacity-60">Festival Type / Genre</Label>
                                    <Input
                                        id="type"
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                        placeholder="Electronic Dance Music"
                                    />
                                    {errors.type && <p className="text-xs text-destructive font-bold">{errors.type}</p>}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="slug" className="uppercase font-bold text-xs opacity-60">System Slug</Label>
                                <Input
                                    id="slug"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    placeholder="tomorrowland-2026"
                                />
                                {errors.slug && <p className="text-xs text-destructive font-bold">{errors.slug}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description" className="uppercase font-bold text-xs opacity-60">About the Festival</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Detailed mission brief about the festival experience..."
                                    className="min-height-[150px]"
                                />
                                {errors.description && <p className="text-xs text-destructive font-bold">{errors.description}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    {errors.category_id && <p className="text-xs text-destructive font-bold">{errors.category_id}</p>}
                                </div>

                                {user?.is_super_admin && (
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
                                        {errors.author_id && <p className="text-xs text-destructive font-bold">{errors.author_id}</p>}
                                    </div>
                                )}
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

                    <Card className="border-agency-accent/10">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="uppercase font-black italic tracking-tight">Festival Gallery</CardTitle>
                            </div>
                            <MediaLibrary 
                                type="image"
                                multiple
                                onSelect={addGalleryImages}
                                trigger={
                                    <Button type="button" variant="outline" size="sm" className="border-agency-accent/20">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Images
                                    </Button>
                                }
                            />
                        </CardHeader>
                        <CardContent>
                            {data.gallery.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {data.gallery.map((url, index) => (
                                        <div key={index} className="group relative aspect-square rounded-xl overflow-hidden border-2 border-agency-accent/10 hover:border-agency-accent transition-all shadow-sm">
                                            <img src={url} alt="" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <Button 
                                                    type="button" 
                                                    variant="destructive" 
                                                    size="icon" 
                                                    className="h-8 w-8"
                                                    onClick={() => removeGalleryImage(url)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                                <div className="h-8 w-8 bg-white/20 backdrop-blur-md rounded-md flex items-center justify-center cursor-grab active:cursor-grabbing">
                                                    <GripVertical className="h-4 w-4 text-white" />
                                                </div>
                                            </div>
                                            <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/50 backdrop-blur-md rounded text-[10px] text-white font-bold">
                                                {index + 1}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-muted-foreground bg-agency-accent/5">
                                    <ImagePlus className="h-10 w-10 mb-4 opacity-20" />
                                    <p className="text-sm font-bold uppercase italic opacity-60">No gallery data</p>
                                    <p className="text-[10px] mt-1 italic">Initialize festival gallery via radar control.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <AnimatePresence>
                    {!isSidebarCollapsed && (
                        <motion.div 
                            initial={{ opacity: 0, x: 20, width: 0 }}
                            animate={{ opacity: 1, x: 0, width: 'auto' }}
                            exit={{ opacity: 0, x: 20, width: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="lg:col-span-3 space-y-6 overflow-hidden"
                        >
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

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label className="font-bold uppercase text-xs">Featured System</Label>
                                            <p className="text-[10px] text-muted-foreground italic">Highlight on home slider</p>
                                        </div>
                                        <Switch
                                            checked={data.is_featured}
                                            onCheckedChange={(checked) => setData('is_featured', checked)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-agency-accent/10">
                                <CardHeader>
                                    <CardTitle className="uppercase font-black italic tracking-tight">Main Signal Image</CardTitle>
                                    <CardDescription className="text-xs opacity-60">
                                        This image will be used as the hero section. Recommended size: 1920x1080px for best quality.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <MediaLibrary 
                                        type="image"
                                        currentValue={data.image}
                                        onSelect={(asset) => setData('image', (asset as MediaAsset).url)}
                                        trigger={
                                            <div 
                                                className="aspect-video rounded-lg border-2 border-dashed border-agency-accent/20 flex flex-col items-center justify-center cursor-pointer hover:bg-agency-accent/5 transition-colors bg-agency-accent/2 overflow-hidden relative shadow-inner"
                                            >
                                                {data.image ? (
                                                    <img src={data.image} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <>
                                                        <ImagePlus className="h-8 w-8 text-agency-accent/40 mb-2" />
                                                        <p className="text-[10px] font-bold uppercase italic text-agency-accent/60">Capture Main Signal</p>
                                                    </>
                                                )}
                                            </div>
                                        }
                                    />
                                    <div className="grid gap-2">
                                        <Label className="uppercase font-bold text-xs opacity-60">Signal URL</Label>
                                        <Input
                                            value={data.image}
                                            onChange={(e) => setData('image', e.target.value)}
                                            placeholder="https://..."
                                            className="text-xs italic"
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
                                            max={data.end_date}
                                            onChange={(e) => setData('start_date', e.target.value)}
                                        />
                                        {errors.start_date && <p className="text-xs text-destructive font-bold">{errors.start_date}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label className="uppercase font-bold text-xs opacity-60">End Point</Label>
                                        <Input
                                            type="date"
                                            value={data.end_date}
                                            min={data.start_date}
                                            onChange={(e) => setData('end_date', e.target.value)}
                                        />
                                        {errors.end_date && <p className="text-xs text-destructive font-bold">{errors.end_date}</p>}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-agency-accent/10">
                                <CardHeader>
                                    <CardTitle className="uppercase font-black italic tracking-tight">Social Intel</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label className="uppercase font-bold text-xs opacity-60">Signal Tags</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                value={newTag}
                                                onChange={(e) => setNewTag(e.target.value)}
                                                placeholder="#techno"
                                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                                className="italic"
                                            />
                                            <Button type="button" size="icon" onClick={addTag} variant="outline" className="border-agency-accent/20">
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {data.social_tags.map(tag => (
                                                <Badge key={tag} className="bg-agency-accent/10 text-agency-accent border-agency-accent/20 font-bold italic py-1">
                                                    #{tag}
                                                    <X className="h-3 w-3 ml-2 cursor-pointer hover:text-destructive" onClick={() => setData('social_tags', data.social_tags.filter(t => t !== tag))} />
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </form>
    );
}
