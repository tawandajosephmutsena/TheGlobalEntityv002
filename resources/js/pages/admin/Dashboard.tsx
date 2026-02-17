import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from '@inertiajs/react';
import {
    FolderOpen,
    Briefcase,
    FileText,
    Users,
    Image,
    MessageSquare,
    Plus,
    Eye,
    Star,
    Settings,
    Globe,
    PanelsTopLeft,
    BookOpen,
    UserCheck,
    HardDrive,
    ShieldCheck,
    TrendingUp,
    ArrowUpRight,
    Sparkles,
    Layers,
    Activity,
    Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

// ─── Types ───────────────────────────────────────────────────────────

interface DashboardStats {
    portfolio_items: { total: number; published: number; featured: number };
    services: { total: number; published: number; featured: number };
    insights: { total: number; published: number; featured: number };
    team_members: { total: number; active: number; featured: number };
    media_assets: { total: number; images: number; videos: number };
    users: { total: number; admins: number; editors: number };
    contact_inquiries: { total: number; new: number; unread: number };
}

interface RecentActivityItem {
    id: number;
    title?: string;
    subject?: string;
    name?: string;
    created_at: string;
    is_published?: boolean;
    status?: string;
}

interface RecentActivity {
    portfolio: RecentActivityItem[];
    insights: RecentActivityItem[];
    inquiries: RecentActivityItem[];
}

interface SeoStats {
    average_score: number;
    pages_needing_attention: number;
    total_pages: number;
}

interface ContentDistribution {
    name: string;
    value: number;
    color: string;
}

interface ContentTimeline {
    date: string;
    portfolio: number;
    insights: number;
    services: number;
}

interface DashboardProps {
    stats: DashboardStats;
    recent_activity: RecentActivity;
    seo_stats: SeoStats;
    content_distribution: ContentDistribution[];
    content_timeline: ContentTimeline[];
}

// ─── Animated Counter ────────────────────────────────────────────────

function AnimatedCounter({ value, duration = 1200 }: { value: number; duration?: number }) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const end = value;
        if (end === 0) return;
        const increment = end / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [value, duration]);
    return <>{count}</>;
}

// ─── Stagger animation variants ─────────────────────────────────────

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.08 },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

// ─── Custom Tooltip ──────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-background/95 backdrop-blur-sm border border-border/50 rounded-xl px-4 py-3 shadow-xl">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
            {payload.map((entry, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="font-semibold capitalize">{entry.name}:</span>
                    <span className="font-black">{entry.value}</span>
                </div>
            ))}
        </div>
    );
}

// ─── Stat Card ───────────────────────────────────────────────────────

function StatCard({
    title,
    icon: Icon,
    total,
    published,
    featured,
    href,
    accentColor,
}: {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    total: number;
    published?: number;
    featured?: number;
    href: string;
    accentColor: string;
}) {
    return (
        <motion.div variants={item}>
            <Card className="group relative overflow-hidden hover:shadow-lg hover:shadow-black/5 transition-all duration-500 border-t-0 border-r-0 border-b-0 border-l-[3px]" style={{ borderLeftColor: accentColor }}>
                {/* Glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: `radial-gradient(circle at 20% 50%, ${accentColor}08, transparent 70%)` }} />
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative">
                    <CardTitle className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">{title}</CardTitle>
                    <div className="p-2 rounded-lg transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
                        <Icon className="h-4 w-4" />
                    </div>
                </CardHeader>
                <CardContent className="relative">
                    <div className="text-3xl font-black tracking-tight">
                        <AnimatedCounter value={total} />
                    </div>
                    <div className="flex gap-2 mt-3">
                        {published !== undefined && (
                            <Badge className="text-[10px] font-bold px-2.5 py-1 bg-emerald-500/15 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20">
                                <Eye className="w-3 h-3 mr-1" />
                                {published} published
                            </Badge>
                        )}
                        {featured !== undefined && (
                            <Badge className="text-[10px] font-bold px-2.5 py-1 bg-amber-500/15 text-amber-400 border-amber-500/20 hover:bg-amber-500/20">
                                <Star className="w-3 h-3 mr-1" />
                                {featured} featured
                            </Badge>
                        )}
                    </div>
                    <Link href={href}>
                        <Button variant="ghost" size="sm" className="mt-3 w-full text-xs font-bold uppercase tracking-wider opacity-60 hover:opacity-100 transition-opacity">
                            Manage
                            <ArrowUpRight className="w-3 h-3 ml-1" />
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </motion.div>
    );
}

// ─── Quick Action Card ───────────────────────────────────────────────

function QuickActionCard({
    title,
    description,
    icon: Icon,
    href,
    gradient,
}: {
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    href: string;
    gradient?: string;
}) {
    return (
        <motion.div variants={item}>
            <Link href={href} className="block">
                <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-500 cursor-pointer h-full border-border/30 hover:border-border/60">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: gradient || 'radial-gradient(circle at 50% 0%, hsl(var(--primary) / 0.05), transparent 70%)' }} />
                    <CardContent className="pt-5 pb-4 relative">
                        <div className="flex items-start gap-3">
                            <div className="p-2.5 rounded-xl bg-muted/60 group-hover:bg-muted transition-colors duration-300 shrink-0">
                                <Icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-bold truncate">{title}</p>
                                <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{description}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Link>
        </motion.div>
    );
}

// ─── Recent Activity Item ────────────────────────────────────────────

function ActivityItem({ item: activityItem, index }: { item: RecentActivityItem; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + index * 0.05, duration: 0.3 }}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/30 transition-all duration-300 group"
        >
            <div className="w-1.5 h-1.5 rounded-full bg-agency-accent/60 shrink-0 group-hover:bg-agency-accent transition-colors" />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                    {activityItem.title || activityItem.subject || `${activityItem.name}: ${activityItem.subject}`}
                </p>
                <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                    {new Date(activityItem.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
            </div>
            {activityItem.is_published !== undefined && (
                <Badge
                    variant={activityItem.is_published ? 'default' : 'secondary'}
                    className="text-[9px] font-bold uppercase tracking-wider h-5 shrink-0"
                >
                    {activityItem.is_published ? 'Live' : 'Draft'}
                </Badge>
            )}
            {activityItem.status && (
                <Badge
                    variant={activityItem.status === 'new' ? 'destructive' : 'secondary'}
                    className="text-[9px] font-bold uppercase tracking-wider h-5 shrink-0"
                >
                    {activityItem.status}
                </Badge>
            )}
        </motion.div>
    );
}

// ─── Progress Bar (animated) ─────────────────────────────────────────

function AnimatedProgressBar({
    label,
    value,
    color,
    delay = 0,
}: {
    label: string;
    value: number;
    color: string;
    delay?: number;
}) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
                <span className="text-xs font-black">{value}%</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1.2, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
            </div>
        </div>
    );
}

// ─── Main Dashboard ──────────────────────────────────────────────────

export default function Dashboard({ stats, recent_activity, seo_stats, content_distribution, content_timeline }: DashboardProps) {
    const breadcrumbs = [
        { title: 'Admin', href: '/admin' },
        { title: 'Dashboard', href: '/admin' },
    ];

    const totalContent = content_distribution.reduce((sum, item) => sum + item.value, 0);
    const portfolioPublishRate = Math.round((stats.portfolio_items.published / (stats.portfolio_items.total || 1)) * 100);
    const insightsPublishRate = Math.round((stats.insights.published / (stats.insights.total || 1)) * 100);
    const servicesPublishRate = Math.round((stats.services.published / (stats.services.total || 1)) * 100);

    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <AdminLayout title="Dashboard" breadcrumbs={breadcrumbs}>
            <div className="space-y-8">
                {/* ─── Header ──────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-4"
                >
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Sparkles className="w-5 h-5 text-agency-accent" />
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-agency-accent">Command Center</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight">Dashboard</h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            {currentDate}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-3 py-1.5 rounded-full border border-emerald-500/20">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-widest">System Online</span>
                        </div>
                        <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider">
                            <Activity className="w-3 h-3 mr-1" />
                            {totalContent} Total Items
                        </Badge>
                    </div>
                </motion.div>

                {/* ─── Stat Cards ──────────────────────────────────────── */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
                >
                    <StatCard
                        title="Portfolio"
                        icon={FolderOpen}
                        total={stats.portfolio_items.total}
                        published={stats.portfolio_items.published}
                        featured={stats.portfolio_items.featured}
                        href="/admin/portfolio"
                        accentColor="#C25E2E"
                    />
                    <StatCard
                        title="Services"
                        icon={Briefcase}
                        total={stats.services.total}
                        published={stats.services.published}
                        featured={stats.services.featured}
                        href="/admin/services"
                        accentColor="#3b82f6"
                    />
                    <StatCard
                        title="Insights"
                        icon={FileText}
                        total={stats.insights.total}
                        published={stats.insights.published}
                        featured={stats.insights.featured}
                        href="/admin/insights"
                        accentColor="#a855f7"
                    />
                    <StatCard
                        title="Inquiries"
                        icon={MessageSquare}
                        total={stats.contact_inquiries.total}
                        published={stats.contact_inquiries.unread}
                        featured={stats.contact_inquiries.new}
                        href="/admin/contact-inquiries"
                        accentColor="#f43f5e"
                    />
                </motion.div>

                {/* ─── Charts Row ──────────────────────────────────────── */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Content Timeline Area Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="lg:col-span-2"
                    >
                        <Card className="overflow-hidden">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-agency-accent" />
                                            Content Timeline
                                        </CardTitle>
                                        <CardDescription className="mt-0.5">Content creation activity over the last 7 days</CardDescription>
                                    </div>
                                    <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider">
                                        7-Day View
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pb-4">
                                <div className="h-[240px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={content_timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="gradPortfolio" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#C25E2E" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#C25E2E" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="gradInsights" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="gradServices" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                                            <XAxis
                                                dataKey="date"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                                            />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} allowDecimals={false} />
                                            <Tooltip content={<ChartTooltip />} />
                                            <Area type="monotone" dataKey="portfolio" stroke="#C25E2E" strokeWidth={2} fillOpacity={1} fill="url(#gradPortfolio)" animationDuration={1500} />
                                            <Area type="monotone" dataKey="insights" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#gradInsights)" animationDuration={1800} />
                                            <Area type="monotone" dataKey="services" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#gradServices)" animationDuration={2100} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                                {/* Legend */}
                                <div className="flex items-center gap-6 mt-3 justify-center">
                                    {[
                                        { label: 'Portfolio', color: '#C25E2E' },
                                        { label: 'Insights', color: '#a855f7' },
                                        { label: 'Services', color: '#3b82f6' },
                                    ].map((entry) => (
                                        <div key={entry.label} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                            {entry.label}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Content Distribution Donut */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <Card className="h-full">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <Layers className="w-4 h-4 text-agency-accent" />
                                    Content Mix
                                </CardTitle>
                                <CardDescription className="mt-0.5">Distribution of content types</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[180px] w-full relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={content_distribution}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={55}
                                                outerRadius={78}
                                                paddingAngle={4}
                                                dataKey="value"
                                                animationBegin={400}
                                                animationDuration={1200}
                                            >
                                                {content_distribution.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<ChartTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    {/* Center label */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="text-center">
                                            <p className="text-2xl font-black">{totalContent}</p>
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Total</p>
                                        </div>
                                    </div>
                                </div>
                                {/* Legend */}
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {content_distribution.map((entry) => (
                                        <div key={entry.name} className="flex items-center gap-2 text-xs">
                                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                                            <span className="text-muted-foreground font-medium truncate">{entry.name}</span>
                                            <span className="font-black ml-auto">{entry.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* ─── Health & Summary Row ──────────────────────────── */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Content Health */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-agency-accent" />
                                    Content Health
                                </CardTitle>
                                <CardDescription>Publish rates across content types</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                <AnimatedProgressBar
                                    label="SEO Score"
                                    value={seo_stats.average_score}
                                    color={seo_stats.average_score >= 80 ? '#22c55e' : seo_stats.average_score >= 60 ? '#eab308' : '#ef4444'}
                                    delay={0.6}
                                />
                                <AnimatedProgressBar label="Portfolio" value={portfolioPublishRate} color="#C25E2E" delay={0.7} />
                                <AnimatedProgressBar label="Insights" value={insightsPublishRate} color="#a855f7" delay={0.8} />
                                <AnimatedProgressBar label="Services" value={servicesPublishRate} color="#3b82f6" delay={0.9} />
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Content Summary (Team, Media, Users) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.55 }}
                        className="lg:col-span-2"
                    >
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-agency-accent" />
                                    Resources Overview
                                </CardTitle>
                                <CardDescription>Team, media, and user account stats</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-3 gap-6">
                                    {/* Team Members */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm font-bold">
                                            <UserCheck className="h-4 w-4 text-blue-400" />
                                            <span>Team</span>
                                        </div>
                                        <div className="space-y-2">
                                            {[
                                                { label: 'Total', value: stats.team_members.total, color: 'text-foreground' },
                                                { label: 'Active', value: stats.team_members.active, color: 'text-green-400' },
                                                { label: 'Featured', value: stats.team_members.featured, color: 'text-amber-400' },
                                            ].map((row) => (
                                                <div key={row.label} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                                                    <span className="text-xs text-muted-foreground font-medium">{row.label}</span>
                                                    <span className={cn('text-lg font-black', row.color)}>
                                                        <AnimatedCounter value={row.value} duration={800} />
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Media Library */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm font-bold">
                                            <HardDrive className="h-4 w-4 text-purple-400" />
                                            <span>Media</span>
                                        </div>
                                        <div className="space-y-2">
                                            {[
                                                { label: 'Total Assets', value: stats.media_assets.total, color: 'text-foreground' },
                                                { label: 'Images', value: stats.media_assets.images, color: 'text-sky-400' },
                                                { label: 'Videos', value: stats.media_assets.videos, color: 'text-rose-400' },
                                            ].map((row) => (
                                                <div key={row.label} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                                                    <span className="text-xs text-muted-foreground font-medium">{row.label}</span>
                                                    <span className={cn('text-lg font-black', row.color)}>
                                                        <AnimatedCounter value={row.value} duration={800} />
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Users */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm font-bold">
                                            <ShieldCheck className="h-4 w-4 text-agency-accent" />
                                            <span>Users</span>
                                        </div>
                                        <div className="space-y-2">
                                            {[
                                                { label: 'Total', value: stats.users.total, color: 'text-foreground' },
                                                { label: 'Admins', value: stats.users.admins, color: 'text-agency-accent' },
                                                { label: 'Editors', value: stats.users.editors, color: 'text-emerald-400' },
                                            ].map((row) => (
                                                <div key={row.label} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                                                    <span className="text-xs text-muted-foreground font-medium">{row.label}</span>
                                                    <span className={cn('text-lg font-black', row.color)}>
                                                        <AnimatedCounter value={row.value} duration={800} />
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* ─── Quick Actions ────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Plus className="w-5 h-5 text-agency-accent" />
                        <h2 className="text-xl font-bold">Quick Actions</h2>
                    </div>
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
                    >
                        <QuickActionCard title="New Portfolio" description="Add a showcase project" icon={FolderOpen} href="/admin/portfolio/create" gradient="radial-gradient(circle at 50% 0%, rgba(194,94,46,0.06), transparent 70%)" />
                        <QuickActionCard title="Write Insight" description="Create a blog post" icon={FileText} href="/admin/insights/create" gradient="radial-gradient(circle at 50% 0%, rgba(168,85,247,0.06), transparent 70%)" />
                        <QuickActionCard title="Add Service" description="New service offering" icon={Briefcase} href="/admin/services/create" gradient="radial-gradient(circle at 50% 0%, rgba(59,130,246,0.06), transparent 70%)" />
                        <QuickActionCard title="Manage Pages" description="Edit site pages" icon={PanelsTopLeft} href="/admin/pages" />
                        <QuickActionCard title="Upload Media" description="Images and files" icon={Image} href="/admin/media/create" />
                        <QuickActionCard title="Team Member" description="Add team members" icon={Users} href="/admin/team/create" />
                        <QuickActionCard title="SEO Dashboard" description="Search optimization" icon={Globe} href="/admin/seo" />
                        <QuickActionCard title="Site Settings" description="Configure website" icon={Settings} href="/admin/settings" />
                        <QuickActionCard title="Docs" description="Guides & reference" icon={BookOpen} href="/documentation" />
                    </motion.div>
                </motion.div>

                {/* ─── Recent Activity ──────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Activity className="w-5 h-5 text-agency-accent" />
                        <h2 className="text-xl font-bold">Recent Activity</h2>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                        {[
                            { title: 'Portfolio', items: recent_activity.portfolio, emptyMsg: 'No portfolio items yet', href: '/admin/portfolio', color: '#C25E2E' },
                            { title: 'Insights', items: recent_activity.insights, emptyMsg: 'No blog posts yet', href: '/admin/insights', color: '#a855f7' },
                            { title: 'Inquiries', items: recent_activity.inquiries, emptyMsg: 'No inquiries yet', href: '/admin/contact-inquiries', color: '#f43f5e' },
                        ].map((section) => (
                            <Card key={section.title} className="border-t-[2px]" style={{ borderTopColor: section.color }}>
                                <CardHeader className="pb-1">
                                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Recent {section.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="pb-3">
                                    {section.items.length > 0 ? (
                                        <div className="space-y-0">
                                            {section.items.slice(0, 3).map((activityItem, index) => (
                                                <ActivityItem key={activityItem.id} item={activityItem} index={index} />
                                            ))}
                                            <Link href={section.href}>
                                                <Button variant="ghost" size="sm" className="w-full mt-1 text-xs font-bold uppercase tracking-wider opacity-50 hover:opacity-100">
                                                    View All
                                                    <ArrowUpRight className="w-3 h-3 ml-1" />
                                                </Button>
                                            </Link>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground py-6 text-center">{section.emptyMsg}</p>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </motion.div>
            </div>
        </AdminLayout>
    );
}