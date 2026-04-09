import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
    Activity,
    Eye, Star, Sparkles, FolderOpen, Briefcase, FileText,
    Calendar, Layers, TrendingUp, UserCheck, HardDrive,
    ShieldCheck, Plus, PanelsTopLeft, Settings, BookOpen, Image,
    ArrowUpRight, MessageSquare, Users, Globe, Settings2, RotateCcw,
    CalendarDays, Mic, Server
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { 
    ResponsiveContainer,
    XAxis, YAxis, CartesianGrid, Tooltip,
    AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';

// Map icon names from backend to Lucide icons
const IconMap: Record<string, any> = {
    'FolderOpen': FolderOpen,
    'Briefcase': Briefcase,
    'FileText': FileText,
    'MessageSquare': MessageSquare,
    'UserCheck': UserCheck,
    'CalendarDays': CalendarDays,
    'Mic': Mic,
    'Star': Star,
};

// ─── Types ───────────────────────────────────────────────────────────

interface RecentActivityItem {
    id: number;
    title?: string;
    subject?: string;
    name?: string;
    created_at: string;
    is_published?: boolean;
    status?: string;
}

interface DashboardSource {
    key: string;
    label: string;
    icon: string;
    color: string;
    isDefaultEnabled: boolean;
    total: number;
    badges: Array<{ label: string; value: number; colorClass?: string }>;
    href: string;
}

interface RecentActivityGroup {
    label: string;
    color: string;
    items: RecentActivityItem[];
    href: string;
    isDefaultEnabled: boolean;
}

interface ContentDistribution {
    name: string;
    value: number;
    color: string;
    key: string;
    isDefaultEnabled: boolean;
}

interface TimelineKey {
    key: string;
    label: string;
    color: string;
    isDefaultEnabled: boolean;
}

interface ContentTimeline {
    data: Array<any>;
    keys: TimelineKey[];
}

interface SeoStats {
    average_score: number;
    pages_needing_attention: number;
    total_pages: number;
}

interface DashboardProps {
    sources: DashboardSource[];
    recent_activity: Record<string, RecentActivityGroup>;
    content_distribution: ContentDistribution[];
    content_timeline: ContentTimeline;
    next_update_timestamp: number;
    seo_stats: SeoStats;
}

// ─── Animated Counter ────────────────────────────────────────────────

function AnimatedCounter({ value, duration = 1200 }: { value: number; duration?: number }) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const end = value;
        if (end === 0) {
            setCount(0);
            return;
        }
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

const itemAnim = {
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
                    <span className={`w-2 h-2 rounded-full`} style={{ backgroundColor: entry.color }} />
                    <span className="font-semibold capitalize">{entry.name}:</span>
                    <span className="font-black">{entry.value}</span>
                </div>
            ))}
        </div>
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
        <motion.div variants={itemAnim}>
            <Link href={href} className="block">
                <Card className={`group relative overflow-hidden hover:shadow-lg transition-all duration-500 cursor-pointer h-full border-border/30 hover:border-border/60 [--action-gradient:${gradient || 'radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.05),transparent_70%)'}]`}>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[var(--action-gradient)]" />
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
            transition={{ delay: 0.2 + index * 0.05, duration: 0.3 }}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/30 transition-all duration-300 group"
        >
            <div className="w-1.5 h-1.5 rounded-full bg-agency-accent/60 shrink-0 group-hover:bg-agency-accent transition-colors" />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                    {activityItem.title || activityItem.subject || `${activityItem.name}: ${activityItem.subject || 'Details'}`}
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
                    style={{ backgroundColor: color } as React.CSSProperties}
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1.2, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
            </div>
        </div>
    );
}

// ─── Main Dashboard ──────────────────────────────────────────────────

export default function Dashboard({ sources, recent_activity, seo_stats, content_distribution, content_timeline, next_update_timestamp }: DashboardProps) {
    const breadcrumbs = [
        { title: 'Admin', href: '/admin' },
        { title: 'Dashboard', href: '/admin' },
    ];

    // Local state for toggling specific legacy modules on/off
    const [enabledSources, setEnabledSources] = useState<Record<string, boolean>>({});
    const [showSettings, setShowSettings] = useState(false);
    
    // Countdown state
    const [countdown, setCountdown] = useState<number>(0);

    // Initialize toggle states
    useEffect(() => {
        const saved = localStorage.getItem('dashboard_source_preferences');
        if (saved) {
            setEnabledSources(JSON.parse(saved));
        } else {
            const initial: Record<string, boolean> = {};
            sources.forEach(src => {
                initial[src.key] = src.isDefaultEnabled;
            });
            setEnabledSources(initial);
        }
    }, [sources]);

    // Handle Toggles
    const toggleSource = (key: string) => {
        const nextState = { ...enabledSources, [key]: !enabledSources[key] };
        setEnabledSources(nextState);
        localStorage.setItem('dashboard_source_preferences', JSON.stringify(nextState));
    };

    // Handle Countdown Timer
    useEffect(() => {
        const tick = () => {
            const now = Date.now();
            const diff = Math.max(0, Math.floor((next_update_timestamp - now) / 1000));
            setCountdown(diff);
        };
        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [next_update_timestamp]);

    // Format countdown (MM:SS)
    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const activeSources = sources.filter(s => enabledSources[s.key]);
    
    // Total for PieChart based on ACTIVE widgets
    const activeDistribution = content_distribution.filter(d => enabledSources[d.key]);
    const totalContent = activeDistribution.reduce((sum, item) => sum + item.value, 0);

    // Timeline keys for AreaChart based on ACTIVE widgets
    const activeTimelineKeys = content_timeline.keys.filter(k => enabledSources[k.key]);

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
                        <p className="text-muted-foreground text-sm mt-1 flex items-center gap-2">
                            {currentDate}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Countdown Timer */}
                        <div className="flex items-center gap-2 bg-muted/60 px-3 py-1.5 rounded-full border border-border">
                            <RotateCcw className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 text-muted-foreground">
                                Updating in <span className="text-foreground font-mono font-black">{formatTime(countdown)}</span>
                            </span>
                        </div>

                        <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider">
                            <Activity className="w-3 h-3 mr-1" />
                            {totalContent} Total Items
                        </Badge>
                        <Button 
                            variant="outline" 
                            size="icon" 
                            className={`rounded-full transition-colors ${showSettings ? 'bg-primary text-primary-foreground border-primary hover:bg-primary hover:text-primary-foreground' : ''}`}
                            onClick={() => setShowSettings(!showSettings)}
                        >
                            <Settings2 className="w-4 h-4" />
                        </Button>
                    </div>
                </motion.div>

                {/* ─── Settings Panel (Slide down) ────────────────────── */}
                <AnimatePresence>
                    {showSettings && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <Card className="border-border bg-muted/30">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                                        <Server className="w-4 h-4" />
                                        Dashboard Sources Config
                                    </CardTitle>
                                    <CardDescription>Toggle visibility for dynamic elements on your dashboard.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {sources.map(source => {
                                            const Icon = IconMap[source.icon] || FolderOpen;
                                            return (
                                                <div key={source.key} className="flex items-center justify-between space-x-2 border border-border/50 bg-background/50 p-3 rounded-lg">
                                                    <div className="flex items-center gap-2 overflow-hidden">
                                                        <Icon className="w-4 h-4 shrink-0" style={{ color: source.color }} />
                                                        <label htmlFor={`toggle-${source.key}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 truncate">
                                                            {source.label}
                                                        </label>
                                                    </div>
                                                    <Switch 
                                                        id={`toggle-${source.key}`} 
                                                        checked={enabledSources[source.key] || false}
                                                        onCheckedChange={() => toggleSource(source.key)}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ─── Dynamic Stat Cards ──────────────────────────────── */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
                >
                    <AnimatePresence>
                    {activeSources.map((source) => {
                        const Icon = IconMap[source.icon] || FolderOpen;
                        return (
                            <motion.div 
                                key={source.key} 
                                variants={itemAnim}
                                exit={{ opacity: 0, scale: 0.95 }}
                                layout
                            >
                                <Card 
                                    className="group relative overflow-hidden hover:shadow-lg hover:shadow-black/5 transition-all duration-500 border-t-0 border-r-0 border-b-0 border-l-[3px] border-l-[var(--accent-color)] h-full"
                                    {...{ style: { '--accent-color': source.color } as React.CSSProperties }}
                                >
                                    <div 
                                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" 
                                        {...{ style: { background: `radial-gradient(circle at 20% 50%, ${source.color}08, transparent 70%)` } }}
                                    />
                                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative">
                                        <CardTitle className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">{source.label}</CardTitle>
                                        <div 
                                            className="p-2 rounded-lg transition-all duration-300 group-hover:scale-110"
                                            {...{ style: { backgroundColor: `color-mix(in srgb, ${source.color}, transparent 85%)`, color: source.color } }}
                                        >
                                            <Icon className="h-4 w-4" />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="relative flex flex-col pt-1 pb-4">
                                        <div className="text-3xl font-black tracking-tight">
                                            <AnimatedCounter value={source.total} />
                                        </div>
                                        <div className="flex gap-2 mb-3 min-h-[22px]">
                                            {source.badges?.map((badge, index) => badge.value !== undefined ? (
                                                <Badge 
                                                    key={index} 
                                                    className={`text-[10px] font-bold px-2 py-0.5 ${badge.colorClass || 'bg-secondary/20 text-secondary-foreground border-secondary/30 hover:bg-secondary/30'}`}
                                                >
                                                    {badge.value} {badge.label}
                                                </Badge>
                                            ) : null)}
                                        </div>
                                        <Link href={source.href} className="mt-auto block">
                                            <Button variant="ghost" size="sm" className="w-full text-xs font-bold uppercase tracking-wider opacity-60 hover:opacity-100 transition-opacity bg-muted/30">
                                                Manage
                                                <ArrowUpRight className="w-3 h-3 ml-1" />
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                    </AnimatePresence>
                </motion.div>

                {/* ─── Charts Row ──────────────────────────────────────── */}
                {activeTimelineKeys.length > 0 && (
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Content Timeline Area Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="lg:col-span-2"
                    >
                        <Card className="overflow-hidden h-full">
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
                                        <AreaChart data={content_timeline.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <defs>
                                                {activeTimelineKeys.map(k => (
                                                    <linearGradient key={k.key} id={`grad_${k.key}`} x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor={k.color} stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor={k.color} stopOpacity={0} />
                                                    </linearGradient>
                                                ))}
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
                                            
                                            {activeTimelineKeys.map((k, idx) => (
                                                <Area 
                                                    key={k.key}
                                                    type="monotone" 
                                                    dataKey={k.key} 
                                                    name={k.label}
                                                    stroke={k.color} 
                                                    strokeWidth={2} 
                                                    fillOpacity={1} 
                                                    fill={`url(#grad_${k.key})`} 
                                                    animationDuration={1500 + (idx * 300)} 
                                                />
                                            ))}
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                                {/* Legend */}
                                <div className="flex items-center gap-6 mt-3 justify-center flex-wrap">
                                    {activeTimelineKeys.map((entry) => (
                                        <div key={entry.key} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                            <span className="w-2 h-2 rounded-full bg-[var(--item-bg)]" style={{ '--item-bg': entry.color } as React.CSSProperties} />
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
                        <Card className="h-[370px] flex flex-col">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <Layers className="w-4 h-4 text-agency-accent" />
                                    Content Mix
                                </CardTitle>
                                <CardDescription className="mt-0.5">Distribution of content types</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow flex flex-col">
                                {totalContent > 0 ? (
                                    <>
                                        <div className="flex-1 w-full relative min-h-[160px]">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={activeDistribution}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={55}
                                                        outerRadius={80}
                                                        paddingAngle={4}
                                                        dataKey="value"
                                                        animationBegin={400}
                                                        animationDuration={1200}
                                                    >
                                                        {activeDistribution.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip content={<ChartTooltip />} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                            {/* Center label */}
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                <div className="text-center">
                                                    <p className="text-3xl font-black leading-none">{totalContent}</p>
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Total</p>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Legend */}
                                        <div className="grid grid-cols-2 gap-x-2 gap-y-3 mt-4">
                                            {activeDistribution.map((entry) => (
                                                <div key={entry.name} className="flex items-center gap-2 text-xs bg-muted/40 p-1.5 rounded">
                                                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                                                    <span className="text-muted-foreground font-medium truncate">{entry.name}</span>
                                                    <span className="font-black ml-auto">{entry.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-muted-foreground text-sm font-medium pb-8">
                                        No data available for selected sources.
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
                )}
                
                {/* ─── Health & Summary Row ──────────────────────────── */}
                <div className="grid gap-6 lg:grid-cols-3">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-agency-accent" />
                                    Platform Health
                                </CardTitle>
                                <CardDescription>SEO rating and vital statistics</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <AnimatedProgressBar
                                    label="SEO Score"
                                    value={seo_stats.average_score}
                                    color={seo_stats.average_score >= 80 ? '#22c55e' : seo_stats.average_score >= 60 ? '#eab308' : '#ef4444'}
                                    delay={0.6}
                                />
                                <div className="space-y-2 mt-4">
                                    <h4 className="text-sm font-bold">SEO Maintenance</h4>
                                    <div className="bg-muted p-3 rounded-lg flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Pages Need Attention</span>
                                        <Badge variant={seo_stats.pages_needing_attention > 0 ? 'destructive' : 'secondary'}>
                                            {seo_stats.pages_needing_attention}
                                        </Badge>
                                    </div>
                                    <div className="bg-muted p-3 rounded-lg flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Pages Indexed</span>
                                        <span className="font-black text-foreground">{seo_stats.total_pages}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Quick Actions Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.55 }}
                        className="lg:col-span-2"
                    >
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <Plus className="w-4 h-4 text-agency-accent" />
                                    Quick Actions
                                </CardTitle>
                                <CardDescription>Launch point for site management</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
                                    <QuickActionCard title="Manage Pages" description="Edit site pages" icon={PanelsTopLeft} href="/admin/pages" />
                                    <QuickActionCard title="Upload Media" description="Images and files" icon={Image} href="/admin/media/create" />
                                    <QuickActionCard title="SEO Dashboard" description="Search optimization" icon={Globe} href="/admin/seo" />
                                    <QuickActionCard title="Site Settings" description="Configure website" icon={Settings} href="/admin/settings" />
                                    <QuickActionCard title="Docs" description="Guides & reference" icon={BookOpen} href="/documentation" />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

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
                    
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        <AnimatePresence>
                            {Object.entries(recent_activity)
                                .filter(([key]) => enabledSources[key])
                                .map(([key, section]) => (
                                <motion.div 
                                    key={key}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    layout
                                >
                                    <Card className="border-t-[2px] h-full" style={{ borderTopColor: section.color }}>
                                        <CardHeader className="pb-2 pt-4">
                                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center justify-between">
                                                Recent {section.label}
                                                <Badge style={{backgroundColor:`${section.color}20`, color: section.color}} className="text-[9px] hover:bg-transparent">{section.items.length}</Badge>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="pb-3 px-3">
                                            {section.items.length > 0 ? (
                                                <div className="space-y-1">
                                                    {section.items.slice(0, 4).map((activityItem, index) => (
                                                        <ActivityItem key={activityItem.id} item={activityItem} index={index} />
                                                    ))}
                                                    <Link href={section.href} className="block mt-2">
                                                        <Button variant="ghost" size="sm" className="w-full text-xs font-bold uppercase tracking-wider opacity-60 hover:opacity-100 bg-muted/40 hover:bg-muted">
                                                            View All
                                                            <ArrowUpRight className="w-3 h-3 ml-1" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            ) : (
                                                <p className="text-xs text-muted-foreground py-6 text-center italic bg-muted/20 rounded-md">No recent additions</p>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </AdminLayout>
    );
}
