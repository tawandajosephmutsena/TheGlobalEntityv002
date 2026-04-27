import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Save, ArrowLeft, ImagePlus, X, Plus, History, Eye, Trash2, List, Type, ImageIcon } from 'lucide-react';
import { Insight, Category, User, SharedData } from '@/types';
import { useForm, Link, usePage } from '@inertiajs/react';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import MediaLibrary from '@/components/admin/MediaLibrary';
import VersionHistory from '@/components/admin/VersionHistory';
import VersionComparison from '@/components/admin/VersionComparison';
import RealTimePreview from '@/components/admin/RealTimePreview';
import PreviewShare from '@/components/admin/PreviewShare';
import { accessibilityManager } from '@/lib/accessibilityManager';
import BlogArticleBuilder from '@/components/admin/BlogBuilder/BlogArticleBuilder';
import { toast } from 'sonner';

export type BlockType = 'hero' | 'text' | 'image' | 'features' | 'stats' | 'services' | 'portfolio' | 'insights' | 'cta' | 'cinematic_hero' | 'form' | 'video' | 'story' | 'manifesto' | 'process' | 'contact_info' | 'faq' | 'animated_shader_hero' | 'testimonials' | 'logo_cloud' | 'apple_cards_carousel' | 'creative_grid' | 'cover_demo' | 'video_background_hero' | 'parallax_features' | 'gsap_horizontal_scroll' | 'kimi_hero' | 'carousel' | 'team_hero' | 'team_grid' | 'culture_bento' | 'team_join' | 'cta_hero' | 'ecosystem_content' | 'enterprise_pricing' | 'faq_section' | 'ai_features' | 'stacking_cards' | 'product_card_stack' | 'stacked_cards' | 'cards_slider' | 'about_hero' | 'about_who_are_you' | 'about_truth_untangled' | 'about_more_than_entertainment' | 'about_origin_story' | 'stitch_featured_blog' | (string & {});

export interface Block {
    id: string;
    type: string;
    content: Record<string, unknown>;
    is_enabled: boolean;
}

const getDefaultContentForType = (type: BlockType) => {
    switch (type) {
        case 'hero': return { 
            title: 'Digital Innovation Redefined', 
            subtitle: 'Creative Agency', 
            description: 'We create inspiring digital experiences.', 
            ctaText: 'View Our Work', 
            ctaHref: '/portfolio', 
            image: '/images/hero-bg.jpg',
            marqueeText: 'Innovate Create Elevate Innovate Create Elevate',
            backgroundImages: [
                'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2670&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2670&auto=format&fit=crop'
            ]
        };
        case 'text': return { 
            title: '', 
            layout: '1',
            columns: [
                {
                    id: 'col-' + Date.now(),
                    type: 'text',
                    content: {
                        body: '',
                        textSize: 'base',
                        textAlign: 'left',
                    }
                }
            ],
            body: '' // Legacy field for backward compatibility
        };
        case 'image': return { url: '', alt: '', caption: '' };
        case 'features': return { title: 'Our Features', items: [{ title: 'Feature 1', desc: 'Description' }] };
        case 'stats': return { 
            title: 'By The Numbers', 
            subtitle: 'Our Impact',
            items: [{ value: '10', label: 'Projects', suffix: '+' }] 
        };
        case 'services': return { title: 'Our Services', limit: 3, useStackedCards: true };
        case 'portfolio': return { title: 'Selected Works', limit: 3 };
        case 'insights': return { title: 'Recent Insights', limit: 3 };
        case 'cinematic_hero': return { slides: [
            { title: 'This is not Compassion', subtitle: 'Compassion would have been a law that protected her before she was forced to give birth.', tagline: '#letherlive', image: '/images/hero-1.jpg' },
            { title: 'A Childhood Stolen', subtitle: 'When laws fail to protect the vulnerable, they actively participate in the cycle of neglect.', tagline: '#protectourgirls', image: '/images/hero-2.jpg' },
            { title: 'Break the Cycle', subtitle: 'Justice is the only path to a world where childhood is a non-negotiable right.', tagline: '#changethelaw', image: '/images/hero-3.jpg' }
        ] };
        case 'animated_shader_hero': return {
            trustBadge: { text: "Trusted by visionaries", icons: ["✨", "🚀"] },
            headline: { line1: "Launch Your", line2: "Next Big Idea" },
            subtitle: "Create stunning digital experiences with our AI-powered platform.",
            buttons: {
                primary: { text: "Get Started", url: "#" },
                secondary: { text: "Learn More", url: "#" }
            }
        };
        case 'form': return {
            title: 'Onboarding',
            description: 'Tell us about your project',
            submitText: 'Submit enquiry',
            successMessage: 'Form submitted successfully!',
            steps: [
                {
                    id: 'personal',
                    title: 'Personal Info',
                    description: 'Let\'s start with some basic information',
                    fields: [
                        { label: 'Full Name', type: 'text', required: true, name: 'name', placeholder: 'John Doe' },
                        { label: 'Email Address', type: 'email', required: true, name: 'email', placeholder: 'john@example.com' },
                        { label: 'Company/Organization (Optional)', type: 'text', required: false, name: 'company', placeholder: 'Your Company' }
                    ]
                },
                {
                    id: 'professional',
                    title: 'Professional',
                    description: 'Tell us about your professional background',
                    fields: [
                        { label: 'What\'s your profession?', type: 'text', required: true, name: 'profession', placeholder: 'e.g. Designer, Developer, Marketer' },
                        { label: 'What industry do you work in?', type: 'select', required: true, name: 'industry', options: ['Technology', 'Healthcare', 'Education', 'Finance', 'Retail', 'Creative Arts', 'Other'] }
                    ]
                },
                {
                    id: 'goals',
                    title: 'Website Goals',
                    description: 'What are you trying to achieve?',
                    fields: [
                        { label: 'What\'s the primary goal of your website?', type: 'radio', required: true, name: 'primaryGoal', options: ['Showcase portfolio/work', 'Sell products/services', 'Generate leads/inquiries', 'Provide information', 'Blog/content publishing'] },
                        { label: 'Who is your target audience?', type: 'textarea', required: false, name: 'targetAudience', placeholder: 'Describe your ideal visitors/customers' }
                    ]
                },
                {
                    id: 'design',
                    title: 'Design',
                    description: 'Tell us about your aesthetic preferences',
                    fields: [
                        { label: 'What style do you prefer for your website?', type: 'radio', required: true, name: 'stylePreference', options: ['Modern & Sleek', 'Minimalist', 'Bold & Creative', 'Corporate & Professional'] },
                        { label: 'Any websites you like for inspiration?', type: 'textarea', required: false, name: 'inspirations', placeholder: 'List websites you admire or want to emulate' }
                    ]
                },
                {
                    id: 'budget',
                    title: 'Budget',
                    description: 'Let\'s talk about your investment',
                    fields: [
                        { label: 'What\'s your budget range? (USD)', type: 'select', required: true, name: 'budget', options: ['Under $1,000', '$1,000 - $3,000', '$3,000 - $5,000', '$5,000 - $10,000', 'Over $10,000'] },
                        { label: 'What\'s your expected timeline?', type: 'radio', required: true, name: 'timeline', options: ['ASAP', 'Within 1 month', '1-3 months', 'Flexible'] }
                    ]
                },
                {
                    id: 'requirements',
                    title: 'Requirements',
                    description: 'Any other specific needs?',
                    fields: [
                        { label: 'Which features do you need?', type: 'checkbox', required: false, name: 'features', options: ['Contact Form', 'Blog/News', 'E-commerce', 'User Accounts', 'Search Functionality', 'Social Media Integration', 'Newsletter Signup', 'Analytics'] },
                        { label: 'Anything else we should know?', type: 'textarea', required: false, name: 'additionalInfo', placeholder: 'Any additional requirements or information' }
                    ]
                }
            ]
        };
        case 'video': return { url: 'https://videos.pexels.com/video-files/30333849/13003128_2560_1440_25fps.mp4' };
        case 'story': return { 
            title: 'A journey of obsession.', 
            subtitle: 'Story',
            body: 'Founded in 2019, we emerged from a singular conviction...', 
            items: [
                { value: '5+', label: 'Years of Craft' },
                { value: '50+', label: 'Successes' }
            ]
        };
        case 'manifesto': return { 
            title: 'Our Core Pillars', 
            subtitle: 'Manifesto',
            items: [
                { title: 'Radical Innovation', desc: 'We don\'t follow trends; we set them.', emoji: '🚀' },
                { title: 'Obsessive Detail', desc: 'Every pixel is scrutinized for perfection.', emoji: '🎯' },
                { title: 'Transparent Partnership', desc: 'We integrate with your team as partners.', emoji: '🤝' }
            ]
        };
        case 'process': return { 
            title: 'From Vision to Reality.', 
            subtitle: 'Our Process',
            items: [
                { step: '01', title: 'Discovery', desc: 'In-depth research and strategy.' },
                { step: '02', title: 'Ideation', desc: 'Creative brainstorming and conceptual design.' },
                { step: '03', title: 'Realization', desc: 'Technical execution and design refinement.' },
                { step: '04', title: 'Infinity', desc: 'Launch and continuous optimization.' }
            ]
        };
        case 'contact_info': return { 
            title: 'We\'re Listening.', 
            subtitle: 'Inquiries',
            items: [
                { label: 'Email', value: 'hello@example.com', href: 'mailto:hello@example.com' },
                { label: 'Phone', value: '+1 (555) 123-4567', href: 'tel:+15551234567' },
                { label: 'Address', value: 'San Francisco, CA', href: '' }
            ],
            office_hours: [
                'Mon — Fri: 09:00 — 18:00',
                'Sat: 10:00 — 14:00',
                'Sun: Closed'
            ],
            show_map: true,
            google_maps_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100939.98555098464!2d-122.507640204439!3d37.757814996609724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1710777326071!5m2!1sen!2sus',
            show_form: true,
            form_title: 'Send us a Message',
            success_message: 'Thank you! Your message has been sent.'
        };
        case 'faq': return { 
            title: 'Common Queries.', 
            subtitle: 'Quick Answers',
            items: [
                { q: 'How long does a typical project take?', a: 'Most boutique projects take 4-12 weeks.' },
                { q: 'Do you work with global clients?', a: 'Absolutely. We have clients across 4 continents.' }
            ]
        };
        default: return {};
    }
};

interface Props {
    insight?: Insight & { blocks?: Block[] };
    categories: Category[];
    authors: User[];
    podcasts?: { id: number; title: string }[];
    festivals?: { id: number; name: string }[];
}

export default function InsightForm({ insight, categories, authors, podcasts = [], festivals = [] }: Props) {
    const { auth } = usePage<SharedData>().props;
    const user = auth?.user;

    // Helper to format date for datetime-local input (YYYY-MM-DDTHH:mm)
    const formatDateForInput = (dateString: string | null) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const { data, setData, post, put, processing, errors } = useForm<{
        title: string;
        slug: string;
        excerpt: string;
        content: { blocks: Block[] };
        featured_image: string;
        author_id: string | number;
        category_id: string | number;
        additional_categories: number[];
        podcast_id: string | number;
        festival_id: string | number;
        tags: string[];
        reading_time: number;
        is_published: boolean;
        is_featured: boolean;
        published_at: string;
        quick_tips: Array<{
            type: 'text' | 'points' | 'image_paragraph';
            title?: string;
            content: string;
            image?: string;
        }>;
    }>({
        title: insight?.title || '',
        slug: insight?.slug || '',
        excerpt: insight?.excerpt || '',
        content: { blocks: insight?.blocks || [] },
        featured_image: insight?.featured_image || '',
        author_id: insight?.author_id || user?.id || authors[0]?.id || '',
        category_id: insight?.category_id || categories[0]?.id || '',
        additional_categories: insight?.additionalCategories?.map((c: { id: number }) => c.id) || [],
        podcast_id: insight?.podcast_id || '',
        festival_id: insight?.festival_id || '',
        tags: insight?.tags || [],
        reading_time: insight?.reading_time || 5,
        is_published: insight?.is_published ?? false,
        is_featured: insight?.is_featured ?? false,
        published_at: insight?.published_at ? formatDateForInput(insight.published_at) : '',
        quick_tips: insight?.quick_tips || [],
    });

    // Auto-generate slug from title
    useEffect(() => {
        if (!insight && data.title) {
            const generatedSlug = data.title
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '-')
                .replace(/^-+|-+$/g, '');
            setData('slug', generatedSlug);
        }
    }, [data.title, insight, setData]);

    const [newTag, setNewTag] = React.useState('');
    const [showVersionHistory, setShowVersionHistory] = React.useState(false);
    const [showVersionComparison, setShowVersionComparison] = React.useState(false);
    const [comparisonVersions, setComparisonVersions] = React.useState<[number, number] | null>(null);
    const [showPreview, setShowPreview] = React.useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    const [blocks, setBlocks] = useState<Block[]>(data.content.blocks || []);

    // Sync blocks state to form data
    useEffect(() => {
        setData('content', { blocks });
    }, [blocks, setData]);

    useEffect(() => {
        if (formRef.current) {
            accessibilityManager.enhanceFormAccessibility(formRef.current);
        }
    }, []);

    const addBlock = useCallback((type: BlockType) => {
        const newBlock: Block = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
            type,
            content: getDefaultContentForType(type),
            is_enabled: true,
        };
        setBlocks(current => [...current, newBlock]);
    }, []);

    const removeBlock = (id: string) => {
        setBlocks(blocks.filter(b => b.id !== id));
    };

    const toggleBlock = (id: string) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, is_enabled: !b.is_enabled } : b));
    };

    const updateBlockContent = (id: string, content: Record<string, unknown>) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, content: { ...b.content, ...content } } : b));
    };

    const duplicateBlock = (id: string) => {
        const blockToClone = blocks.find(b => b.id === id);
        if (!blockToClone) return;
        
        const newBlock: Block = {
            ...blockToClone,
            id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
            content: { ...blockToClone.content },
        };
        const blockIndex = blocks.findIndex(b => b.id === id);
        const newBlocks = [...blocks];
        newBlocks.splice(blockIndex + 1, 0, newBlock);
        setBlocks(newBlocks);
        toast.success('Block duplicated');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Debug: log what we're sending
        const contentLength = data.content?.body?.length || 0;
        const jsonLength = JSON.stringify(data).length;
        console.log('[Insight Save] Content length:', contentLength, 'Total JSON:', jsonLength);
        console.log('[Insight Save] Data keys:', Object.keys(data));
        console.log('[Insight Save] Content body preview:', data.content?.body?.substring(0, 200));
        
        const options = {
            onError: (formErrors: Record<string, string>) => {
                console.error('[Insight Save] Validation errors:', formErrors);
                // Scroll to top to show the error banner
                window.scrollTo({ top: 0, behavior: 'smooth' });
                // Show all errors as alert so user always sees them
                const errorMessages = Object.entries(formErrors).map(([k, v]) => `${k}: ${v}`).join('\n');
                alert('Save failed with validation errors:\n' + errorMessages);
            },
            onSuccess: () => {
                console.log('[Insight Save] Success!');
                localStorage.removeItem(`insight-draft-${insight?.id || 'new'}`);
            },
        };
        
        console.log('[Insight Save] Submitting...');
        if (insight) {
            put(`/admin/insights/${insight.slug}`, options);
        } else {
            post('/admin/insights', options);
        }
    };

    const addTag = () => {
        if (newTag && !data.tags.includes(newTag)) {
            setData('tags', [...data.tags, newTag]);
            setNewTag('');
        }
    };

    const removeTag = (tag: string) => {
        setData('tags', data.tags.filter((t) => t !== tag));
    };

    const handleVersionRestore = () => {
        // Refresh the page to load the restored content
        window.location.reload();
    };

    const handleVersionCompare = (version1: number, version2: number) => {
        setComparisonVersions([version1, version2]);
        setShowVersionComparison(true);
        setShowVersionHistory(false);
    };

    const addTip = () => {
        setData('quick_tips', [...data.quick_tips, { type: 'text', title: '', content: '', image: '' }]);
    };

    const removeTip = (index: number) => {
        setData('quick_tips', data.quick_tips.filter((_, i) => i !== index));
    };

    const updateTip = (index: number, field: string, value: string) => {
        const newTips = [...data.quick_tips];
        newTips[index] = { ...newTips[index], [field]: value };
        setData('quick_tips', newTips);
    };

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            {/* Global validation errors */}
            {Object.keys(errors).length > 0 && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                    <p className="text-sm font-medium text-destructive mb-1">Please fix the following errors:</p>
                    <ul className="list-disc list-inside text-sm text-destructive/80">
                        {Object.entries(errors).map(([key, msg]) => (
                            <li key={key}>{msg}</li>
                        ))}
                    </ul>
                </div>
            )}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/insights">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {insight ? 'Edit Article' : 'New Article'}
                    </h1>
                </div>
                <Button type="submit" disabled={processing} className="bg-agency-accent text-agency-primary hover:bg-agency-accent/90">
                    <Save className="h-4 w-4 mr-2" />
                    {insight ? 'Update Article' : 'Publish Article'}
                </Button>
                {insight && (
                    <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowVersionHistory(!showVersionHistory)}
                        className="gap-2"
                    >
                        <History className="h-4 w-4" />
                        Version History
                    </Button>
                )}
                <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowPreview(!showPreview)}
                    className="gap-2"
                >
                    <Eye className="h-4 w-4" />
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Article Content</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="The Future of Digital Design"
                                />
                                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="excerpt">Excerpt</Label>
                                <Textarea
                                    id="excerpt"
                                    value={data.excerpt}
                                    onChange={(e) => setData('excerpt', e.target.value)}
                                    placeholder="A brief summary for the blog list..."
                                    rows={3}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>Content & Layout Builder</Label>
                                <div className="min-h-[600px] border rounded-xl overflow-hidden bg-muted/5">
                                    <BlogArticleBuilder 
                                        blocks={blocks}
                                        setBlocks={setBlocks}
                                        onUpdateBlock={updateBlockContent}
                                        onAddBlock={addBlock}
                                        onRemoveBlock={removeBlock}
                                        onDuplicateBlock={duplicateBlock}
                                        onToggleBlock={toggleBlock}
                                        pageTitle={data.title || 'New Article'}
                                        pageSlug={data.slug || 'preview-placeholder'}
                                        previewBaseUrl="/blog"
                                        onSave={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
                                        isProcessing={processing}
                                        isEdit={!!insight}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Visual article builder. Add sections, images, and text with full layout control.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Quick Tips</CardTitle>
                            <Button type="button" size="sm" onClick={addTip} className="bg-agency-accent/10 text-agency-accent hover:bg-agency-accent/20 border-agency-accent/20">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Tip
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {data.quick_tips.length === 0 && (
                                <div className="text-center py-10 border-2 border-dashed rounded-xl opacity-40">
                                    <List className="mx-auto h-8 w-8 mb-2" />
                                    <p className="text-sm">No quick tips added yet.</p>
                                </div>
                            )}

                            {data.quick_tips.map((tip, index) => (
                                <div key={index} className="relative p-6 rounded-2xl border border-agency-primary/5 dark:border-white/5 bg-agency-primary/[0.02] dark:bg-white/[0.02] group">
                                    <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button 
                                            type="button" 
                                            size="icon" 
                                            variant="ghost" 
                                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => removeTip(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="grid gap-2">
                                                <Label>Tip Type</Label>
                                                <div className="flex gap-2">
                                                    <Button 
                                                        type="button" 
                                                        size="sm" 
                                                        variant={tip.type === 'text' ? 'default' : 'outline'}
                                                        className={tip.type === 'text' ? 'bg-agency-accent text-agency-primary' : ''}
                                                        onClick={() => updateTip(index, 'type', 'text')}
                                                    >
                                                        <Type className="h-4 w-4 mr-2" /> Text
                                                    </Button>
                                                    <Button 
                                                        type="button" 
                                                        size="sm" 
                                                        variant={tip.type === 'points' ? 'default' : 'outline'}
                                                        className={tip.type === 'points' ? 'bg-agency-accent text-agency-primary' : ''}
                                                        onClick={() => updateTip(index, 'type', 'points')}
                                                    >
                                                        <List className="h-4 w-4 mr-2" /> Points
                                                    </Button>
                                                    <Button 
                                                        type="button" 
                                                        size="sm" 
                                                        variant={tip.type === 'image_paragraph' ? 'default' : 'outline'}
                                                        className={tip.type === 'image_paragraph' ? 'bg-agency-accent text-agency-primary' : ''}
                                                        onClick={() => updateTip(index, 'type', 'image_paragraph')}
                                                    >
                                                        <ImageIcon className="h-4 w-4 mr-2" /> Image
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="grid gap-2">
                                                <Label>Title (Optional)</Label>
                                                <Input 
                                                    value={tip.title || ''} 
                                                    onChange={(e) => updateTip(index, 'title', e.target.value)}
                                                    placeholder="Tip Heading..."
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label>Content {tip.type === 'points' && '(Separate by new lines for points)'}</Label>
                                                <Textarea 
                                                    value={tip.content || ''} 
                                                    onChange={(e) => updateTip(index, 'content', e.target.value)}
                                                    placeholder={tip.type === 'points' ? "- Point one\n- Point two" : "Write your tip here..."}
                                                    rows={4}
                                                />
                                            </div>
                                        </div>

                                        {(tip.type === 'image_paragraph' || tip.type === 'text') && (
                                            <div className="space-y-4">
                                                <Label>Tip Image {tip.type === 'text' && '(Optional)'}</Label>
                                                <MediaLibrary 
                                                    type="image"
                                                    currentValue={tip.image}
                                                    onSelect={(asset) => updateTip(index, 'image', asset.url)}
                                                    trigger={
                                                        <div className="aspect-video rounded-xl border border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-agency-primary/5 dark:hover:bg-white/5 transition-colors overflow-hidden">
                                                            {tip.image ? (
                                                                <img src={tip.image} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <>
                                                                    <ImagePlus className="h-6 w-6 mb-2 opacity-20" />
                                                                    <span className="text-[10px] uppercase tracking-widest opacity-40">Select Image</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    }
                                                />
                                                <Input 
                                                    value={tip.image || ''} 
                                                    onChange={(e) => updateTip(index, 'image', e.target.value)}
                                                    placeholder="Image URL..."
                                                    className="text-xs"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Publishing</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>Published</Label>
                                <Switch
                                    checked={data.is_published}
                                    onCheckedChange={(checked) => setData('is_published', checked)}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label>Featured</Label>
                                <Switch
                                    checked={data.is_featured}
                                    onCheckedChange={(checked) => setData('is_featured', checked)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="published_at">Publication Date</Label>
                                <Input
                                    id="published_at"
                                    type="datetime-local"
                                    value={data.published_at}
                                    onChange={(e) => setData('published_at', e.target.value)}
                                    className="bg-background border-agency-accent/20 focus:border-agency-accent/50 focus:ring-agency-accent/20"
                                />
                                {errors.published_at && (
                                    <p className="text-sm text-destructive mt-1">{errors.published_at}</p>
                                )}
                            </div>
                            {user?.is_super_admin && (
                                <div className="grid gap-2 text-xs">
                                   <Label>Author</Label>
                                   <Select 
                                        value={data.author_id.toString()} 
                                        onValueChange={(val) => setData('author_id', parseInt(val))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select author" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {authors.map(author => (
                                                <SelectItem key={author.id} value={author.id.toString()}>
                                                    {author.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                   </Select>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Cataloging</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Primary Category</Label>
                                <Select 
                                    value={data.category_id?.toString()} 
                                    onValueChange={(val) => setData('category_id', parseInt(val))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(cat => (
                                            <SelectItem key={cat.id} value={cat.id.toString()}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.category_id && <p className="text-sm text-destructive">{errors.category_id}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label>Additional Categories</Label>
                                <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto border rounded-md p-3 bg-card">
                                    {categories.map(cat => (
                                        <div key={cat.id} className="flex items-center space-x-2">
                                            <Checkbox 
                                                id={`add-cat-${cat.id}`} 
                                                checked={data.additional_categories.includes(cat.id)}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setData('additional_categories', [...data.additional_categories, cat.id]);
                                                    } else {
                                                        setData('additional_categories', data.additional_categories.filter(id => id !== cat.id));
                                                    }
                                                }}
                                            />
                                            <label 
                                                htmlFor={`add-cat-${cat.id}`}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                {cat.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label>Link Podcast</Label>
                                <Select 
                                    value={data.podcast_id ? data.podcast_id.toString() : "none"} 
                                    onValueChange={(val) => setData('podcast_id', val === "none" ? '' : parseInt(val))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select podcast" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">None</SelectItem>
                                        {podcasts.map(podcast => (
                                            <SelectItem key={podcast.id} value={podcast.id.toString()}>
                                                {podcast.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label>Link Festival</Label>
                                <Select 
                                    value={data.festival_id ? data.festival_id.toString() : "none"} 
                                    onValueChange={(val) => setData('festival_id', val === "none" ? '' : parseInt(val))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select festival" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">None</SelectItem>
                                        {festivals.map(festival => (
                                            <SelectItem key={festival.id} value={festival.id.toString()}>
                                                {festival.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Tags</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        placeholder="Add tag..."
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                    />
                                    <Button type="button" size="icon" onClick={addTag} variant="outline">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {data.tags.map(tag => (
                                         <Badge key={tag} variant="secondary" className="gap-1 px-1.5">
                                            {tag}
                                            <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                                         </Badge>
                                    ))}
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="reading_time">Reading Time (min)</Label>
                                <Input
                                    id="reading_time"
                                    type="number"
                                    value={data.reading_time}
                                    onChange={(e) => setData('reading_time', parseInt(e.target.value))}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Featured Image</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <MediaLibrary 
                                type="image"
                                currentValue={data.featured_image}
                                onSelect={(asset) => setData('featured_image', asset.url)}
                                trigger={
                                    <div 
                                        className="aspect-video rounded border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-muted mb-3 overflow-hidden bg-muted/20"
                                    >
                                        {data.featured_image ? (
                                            <img src={data.featured_image} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <ImagePlus className="h-8 w-8 text-muted-foreground" />
                                        )}
                                    </div>
                                }
                            />
                            <Input
                                value={data.featured_image}
                                onChange={(e) => setData('featured_image', e.target.value)}
                                placeholder="Image URL"
                                className="text-xs"
                            />
                        </CardContent>
                    </Card>

                    {insight && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Preview Sharing</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <PreviewShare
                                    contentType="insight"
                                    contentId={insight.id}
                                    contentTitle={data.title}
                                />
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Version History and Comparison */}
            {insight && showVersionHistory && !showVersionComparison && (
                <div className="mt-6">
                    <VersionHistory
                        contentType="insight"
                        contentId={insight.id}
                        onRestore={handleVersionRestore}
                        onCompare={handleVersionCompare}
                    />
                </div>
            )}

            {insight && showVersionComparison && comparisonVersions && (
                <div className="mt-6">
                    <VersionComparison
                        contentType="insight"
                        contentId={insight.id}
                        version1={comparisonVersions[0]}
                        version2={comparisonVersions[1]}
                        onClose={() => {
                            setShowVersionComparison(false);
                            setShowVersionHistory(true);
                            setComparisonVersions(null);
                        }}
                    />
                </div>
            )}

            {/* Real-time Preview */}
            <RealTimePreview
                data={{
                    ...data,
                    author_id: typeof data.author_id === 'string' ? parseInt(data.author_id) : data.author_id,
                    category_id: typeof data.category_id === 'string' ? parseInt(data.category_id) : data.category_id,
                }}
                contentType="insight"
                isVisible={showPreview}
                onToggle={() => setShowPreview(!showPreview)}
            />
        </form>
    );
}
