import React, { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { 
    Card, CardContent, CardDescription, CardHeader, CardTitle 
} from '@/components/ui/card';
import { 
    Users, MousePointer2, Clock, Globe, 
    ArrowUpRight, ArrowDownRight, RefreshCcw,
    Monitor, Smartphone, Tablet
} from 'lucide-react';
import { 
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';
import { Button } from '@/components/ui/button';
import { 
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';

interface AnalyticsProps {
    currentRange?: string;
    totalVisits?: number;
    visitTrend?: number;
    uniqueVisitors?: number;
    uniqueTrend?: number;
    activeNow?: number;
    activeTrend?: number;
    bounceRate?: number;
    bounceTrend?: number;
    engagementPeak?: string;
    conversionRate?: number;
    chartData?: Array<{ date: string; views: number; unique: number }>;
    browserData?: Array<{ name: string; value: number }>;
    deviceData?: Array<{ name: string; value: number }>;
    topPages?: Array<{ url: string; count: number; bounceRate: string }>;
    topReferrers?: Array<{ referer: string; count: number; conversion: string }>;
    interactionIntel?: Array<{ label: string; count: number }>;
    heatmapData?: Array<{ day: number; hour: number; count: number }>;
    sparklineData?: {
        visits: any[];
        unique: number[];
    };
    platformStats?: Array<{
        key: string;
        label: string;
        icon: string;
        color: string;
        total: number;
    }>;
}

const Sparkline = ({ data, color }: { data: any[], color: string }) => (
    <div className="h-10 w-24">
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
                <Area 
                    type="monotone" 
                    dataKey="views" 
                    stroke={color} 
                    fill={color} 
                    fillOpacity={0.1} 
                    strokeWidth={2}
                />
            </AreaChart>
        </ResponsiveContainer>
    </div>
);

const EngagementHeatmap = ({ data }: { data: any[] }) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const hours = Array.from({ length: 24 }, (_, i) => i);
    
    const maxValue = Math.max(...data.map(d => d.count), 1);

    return (
        <div className="overflow-x-auto pb-4">
            <div className="min-w-[600px]">
                <div className="grid grid-cols-[30px_repeat(24,1fr)] gap-1">
                    <div />
                    {hours.map(h => (
                        <div key={h} className="text-[8px] font-black opacity-40 text-center uppercase tracking-tighter">
                            {h}h
                        </div>
                    ))}
                    
                    {days.map((day, dIdx) => (
                        <React.Fragment key={day}>
                            <div className="text-[8px] font-black opacity-40 flex items-center uppercase tracking-tighter">
                                {day}
                            </div>
                            {hours.map(hour => {
                                const entry = data.find(d => d.day === dIdx && d.hour === hour);
                                const intensity = entry ? (entry.count / maxValue) : 0;
                                return (
                                    <Tooltip key={hour}>
                                        <div 
                                            className="aspect-square rounded-[1px] transition-all hover:scale-125 hover:z-10 cursor-crosshair"
                                            style={{ 
                                                backgroundColor: intensity > 0 ? `rgba(212, 0, 0, ${0.1 + intensity * 0.9})` : 'rgba(255,255,255,0.03)' 
                                            }}
                                            title={`${day} ${hour}:00 - ${entry?.count || 0} visits`}
                                        />
                                    </Tooltip>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default function Analytics({ 
    currentRange = '30d',
    totalVisits = 0, 
    visitTrend = 0,
    uniqueVisitors = 0, 
    uniqueTrend = 0,
    activeNow = 0,
    activeTrend = 0,
    bounceRate = 0,
    bounceTrend = 0,
    engagementPeak = 'N/A',
    conversionRate = 0,
    chartData = [], 
    browserData = [], 
    deviceData = [], 
    topPages = [], 
    topReferrers = [],
    interactionIntel = [],
    heatmapData = [],
    sparklineData = { visits: [], unique: [] },
    platformStats = []
}: AnalyticsProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleRangeChange = (value: string) => {
        setIsLoading(true);
        router.get('/admin/analytics', { range: value }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            onFinish: () => setIsLoading(false)
        });
    };

    const visitStats = [
        { 
            title: 'Total Visits', 
            value: totalVisits.toLocaleString(), 
            trend: visitTrend, 
            icon: MousePointer2,
            color: 'primary'
        },
        { 
            title: 'Unique Visitors', 
            value: uniqueVisitors.toLocaleString(), 
            trend: uniqueTrend, 
            icon: Users,
            color: 'blue'
        },
        { 
            title: 'Active Now', 
            value: activeNow.toLocaleString(), 
            trend: activeTrend,
            icon: Clock,
            color: 'emerald'
        },
        { 
            title: 'Bounce Rate', 
            value: `${bounceRate}%`, 
            trend: bounceTrend,
            icon: ArrowDownRight,
            color: 'orange'
        },
    ];

    const COLORS = ['#D40000', '#2563EB', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

    const totalViews = chartData.reduce((acc, curr) => acc + (curr.views || 0), 0) || totalVisits || 1;

    return (
        <AdminLayout>
            <Head title="Analytics" />

            <div className="space-y-8 pb-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter italic">
                            Performance <span className="text-agency-accent">Intelligence</span>
                        </h1>
                        <p className="text-muted-foreground mt-1 font-medium italic tracking-tight">Real-time engagement metrics and audience insights.</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Select value={currentRange} onValueChange={handleRangeChange}>
                            <SelectTrigger className="w-[180px] bg-background border-agency-accent/20">
                                <SelectValue placeholder="Select range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="24h">Last 24 Hours</SelectItem>
                                <SelectItem value="7d">Last 7 Days</SelectItem>
                                <SelectItem value="30d">Last 30 Days</SelectItem>
                                <SelectItem value="90d">Last 90 Days</SelectItem>
                            </SelectContent>
                        </Select>
                        
                        <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleRangeChange(currentRange)}
                            disabled={isLoading}
                        >
                            <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {visitStats.map((stat, idx) => (
                        <Card key={stat.title} className="relative overflow-hidden group border-agency-accent/10 hover:border-agency-accent/30 transition-all duration-300 bg-card/40 backdrop-blur-md">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-xs font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                                    {stat.title}
                                    {stat.title === 'Active Now' && activeNow > 0 && (
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                        </span>
                                    )}
                                </CardTitle>
                                <stat.icon className="h-4 w-4 text-agency-accent" />
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-end justify-between">
                                    <div>
                                        <div className="text-3xl font-black tracking-tighter italic">{stat.value}</div>
                                        <div className="flex items-center mt-1">
                                            {stat.trend > 0 ? (
                                                <ArrowUpRight className="h-4 w-4 text-emerald-500 mr-1" />
                                            ) : (
                                                <ArrowDownRight className="h-4 w-4 text-agency-accent mr-1" />
                                            )}
                                            <span className={`text-xs font-bold ${stat.trend > 0 ? 'text-emerald-500' : 'text-agency-accent'}`}>
                                                {stat.trend === 0 && idx < 2 ? 'Stable' : `${Math.abs(stat.trend)}%`}
                                            </span>
                                        </div>
                                    </div>
                                    <Sparkline 
                                        data={stat.title === 'Total Visits' ? sparklineData.visits : sparklineData.visits} 
                                        color={stat.title === 'Total Visits' ? '#D40000' : '#2563EB'} 
                                    />
                                </div>
                            </CardContent>
                            <div className="absolute bottom-0 left-0 h-1 bg-agency-accent/5 w-0 group-hover:w-full transition-all duration-500" />
                        </Card>
                    ))}
                </div>

                <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                    {/* Traffic Area Chart */}
                    <Card className="lg:col-span-2 border-agency-accent/10 bg-black/5 dark:bg-white/5 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-xl font-black uppercase tracking-tight">Traffic Overview</CardTitle>
                            <CardDescription className="italic font-medium">Daily visits and unique visitors trend.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#D40000" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#D40000" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorUnique" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
                                    <XAxis 
                                        dataKey="date" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fontSize: 9, fontWeight: 700, fill: 'currentColor', opacity: 0.5}}
                                        dy={10}
                                        tickFormatter={(str) => {
                                            const d = new Date(str);
                                            return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
                                        }}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fontSize: 9, fontWeight: 700, fill: 'currentColor', opacity: 0.5}}
                                    />
                                    <Tooltip 
                                        contentStyle={{backgroundColor: '#000', border: 'none', borderRadius: '12px', color: '#fff', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                                        itemStyle={{fontWeight: 800, textTransform: 'uppercase', fontSize: '9px'}}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="views" 
                                        name="Page Views"
                                        stroke="#D40000" 
                                        strokeWidth={3}
                                        fillOpacity={1} 
                                        fill="url(#colorViews)" 
                                        animationDuration={1500}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="unique" 
                                        name="Unique Visitors"
                                        stroke="#2563EB" 
                                        strokeWidth={2}
                                        fillOpacity={1} 
                                        fill="url(#colorUnique)" 
                                        strokeDasharray="5 5"
                                        animationDuration={2000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Engagement Heatmap */}
                    <Card className="lg:col-span-3 border-agency-accent/10 bg-black/5 dark:bg-white/5 backdrop-blur-md">
                        <CardHeader>
                            <CardTitle className="text-xl font-black uppercase tracking-tight">Access Density</CardTitle>
                            <CardDescription className="italic font-medium">Hourly engagement patterns by day of week.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <EngagementHeatmap data={heatmapData} />
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {/* Access Devices (Reorganized) */}
                    <Card className="border-agency-accent/10 bg-card/40">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold uppercase tracking-tight">Access Devices</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {deviceData.map((device, idx) => (
                                    <div key={device.name} className="flex items-center gap-4">
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between text-xs font-black tracking-widest uppercase">
                                                <span>{device.name}</span>
                                                <span>{device.value}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full transition-all duration-1000"
                                                    {...{ style: { 
                                                        width: `${device.value}%`,
                                                        backgroundColor: COLORS[idx % COLORS.length]
                                                    } }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Interaction Intel */}
                    <Card className="border-agency-accent/10 bg-card/40">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold uppercase tracking-tight">Interaction Intel</CardTitle>
                            <CardDescription className="italic">Most clicked site elements.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {interactionIntel.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between text-[10px] font-bold uppercase tracking-tighter group cursor-default">
                                        <span className="truncate max-w-[160px] opacity-60 group-hover:opacity-100 transition-opacity" title={item.label}>{item.label}</span>
                                        <span className="text-agency-accent font-black">{item.count}</span>
                                    </div>
                                ))}
                                {interactionIntel.length === 0 && (
                                    <p className="text-xs text-muted-foreground italic text-center py-4">No interaction data available</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Content Modules Summary */}
                    <Card className="border-agency-accent/10 bg-card/40">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold uppercase tracking-tight">Platform Content</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <div className="space-y-3">
                                    {platformStats.filter(s => s.total > 0).map((stat) => (
                                        <div key={stat.key} className="space-y-1">
                                            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: stat.color }} />
                                                    <span>{stat.label}</span>
                                                </div>
                                                <span className="font-black">{stat.total}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                        </CardContent>
                    </Card>

                    {/* Top Pages Table (Moved to Grid) */}
                    <Card className="border-agency-accent/10 bg-card/40">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-bold uppercase tracking-tight">Top Pages</CardTitle>
                            <Globe className="h-4 w-4 text-agency-accent opacity-50" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {topPages.slice(0, 8).map((page, i) => (
                                    <div key={i} className="flex items-center justify-between group cursor-default">
                                        <div className="text-[10px] font-bold truncate max-w-[140px] group-hover:text-agency-accent transition-colors tracking-tight uppercase opacity-60 group-hover:opacity-100">{page.url}</div>
                                        <div className="text-right">
                                            <div className="text-[10px] font-black italic tracking-tighter">{page.count.toLocaleString()}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
                    {/* Referrer Sources */}
                    <Card className="lg:col-span-2 border-agency-accent/10 bg-card/40">
                        <CardHeader>
                            <CardTitle className="text-xl font-black uppercase tracking-tight">Lead Sources</CardTitle>
                            <CardDescription className="italic font-medium">Traffic acquisition performance.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {topReferrers.map((source, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between text-xs font-black tracking-widest uppercase">
                                                <span>{source.referer || 'Direct'}</span>
                                                <span>{Math.round((source.count / (chartData.reduce((acc, curr) => acc + (curr.views || 0), 0) || totalVisits || 1)) * 100)}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-agency-accent/40"
                                                    {...{ style: { width: `${(source.count / (chartData.reduce((acc, curr) => acc + (curr.views || 0), 0) || totalVisits || 1)) * 100}%` } }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Velocity Report */}
                    <Card className="bg-agency-accent text-white border-none shadow-xl shadow-agency-accent/20">
                        <CardHeader>
                            <CardTitle className="text-xl font-black uppercase italic tracking-tighter">Velocity Report</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <p className="text-xs font-bold uppercase tracking-widest opacity-80">Peak Engagement Window</p>
                                <p className="text-2xl font-black tracking-tighter">{engagementPeak}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-xs font-bold uppercase tracking-widest opacity-80">Active Conversion Strength</p>
                                <p className="text-2xl font-black tracking-tighter">{conversionRate}% Intensity</p>
                            </div>
                            <div className="pt-4 mt-4 border-t border-white/20">
                                <Button 
                                    className="w-full bg-white text-agency-accent hover:bg-white/90 font-black uppercase italic italic"
                                    onClick={() => {
                                        window.location.href = `/admin/analytics/export?range=${currentRange}`;
                                    }}
                                >
                                    Download Full Data Intel
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
