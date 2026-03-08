import React, { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Head } from '@inertiajs/react';
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
    totalVisits?: number;
    uniqueVisitors?: number;
    activeNow?: number;
    chartData?: Array<{ date: string; views: number; unique: number }>;
    browserData?: Array<{ name: string; value: number }>;
    deviceData?: Array<{ name: string; value: number }>;
    topPages?: Array<{ url: string; count: number; bounceRate: string }>;
    topReferrers?: Array<{ referer: string; count: number; conversion: string }>;
}

export default function Analytics({ 
    totalVisits = 0, 
    uniqueVisitors = 0, 
    activeNow = 0,
    chartData = [], 
    browserData = [], 
    deviceData = [], 
    topPages = [], 
    topReferrers = [] 
}: AnalyticsProps) {
    const [timeRange, setTimeRange] = useState('30d');
    const [isLoading, setIsLoading] = useState(false);

    const visitStats = [
        { 
            title: 'Total Visits', 
            value: totalVisits.toLocaleString(), 
            trend: 12.5, // Placeholder if not in controller
            icon: MousePointer2,
            color: 'primary'
        },
        { 
            title: 'Unique Visitors', 
            value: uniqueVisitors.toLocaleString(), 
            trend: 8.2, 
            icon: Users,
            color: 'blue'
        },
        { 
            title: 'Active Now', 
            value: activeNow.toLocaleString(), 
            trend: 4.1,
            icon: Clock,
            color: 'emerald'
        },
        { 
            title: 'Bounce Rate', 
            value: '32.4%', 
            trend: -2.4,
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
                        <Select value={timeRange} onValueChange={setTimeRange}>
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
                            onClick={() => setIsLoading(true)}
                            disabled={isLoading}
                        >
                            <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {visitStats.map((stat) => (
                        <Card key={stat.title} className="relative overflow-hidden group border-agency-accent/10 hover:border-agency-accent/30 transition-all duration-300">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-xs font-black uppercase tracking-widest opacity-60">
                                    {stat.title}
                                </CardTitle>
                                <stat.icon className="h-4 w-4 text-agency-accent" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black tracking-tighter italic">{stat.value}</div>
                                <div className="flex items-center mt-1">
                                    {stat.trend > 0 ? (
                                        <ArrowUpRight className="h-4 w-4 text-emerald-500 mr-1" />
                                    ) : (
                                        <ArrowDownRight className="h-4 w-4 text-agency-accent mr-1" />
                                    )}
                                    <span className={`text-xs font-bold ${stat.trend > 0 ? 'text-emerald-500' : 'text-agency-accent'}`}>
                                        {Math.abs(stat.trend)}% vs last period
                                    </span>
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
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
                                    <XAxis 
                                        dataKey="date" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fontSize: 10, fontWeight: 700}}
                                        dy={10}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fontSize: 10, fontWeight: 700}}
                                    />
                                    <Tooltip 
                                        contentStyle={{backgroundColor: 'black', border: 'none', borderRadius: '8px', color: 'white'}}
                                        itemStyle={{fontWeight: 800, textTransform: 'uppercase', fontSize: '10px'}}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="views" 
                                        stroke="#D40000" 
                                        strokeWidth={4}
                                        fillOpacity={1} 
                                        fill="url(#colorViews)" 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        {/* Device Breakdown */}
                        <Card className="border-agency-accent/10">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold uppercase tracking-tight">Access Devices</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {deviceData.map((device, idx) => (
                                        <div key={device.name} className="flex items-center gap-4">
                                            <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5">
                                                {device.name === 'Desktop' ? <Monitor className="h-5 w-5" /> : 
                                                 device.name === 'Mobile' ? <Smartphone className="h-5 w-5" /> : 
                                                 <Tablet className="h-5 w-5" />}
                                            </div>
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
                                    {deviceData.length === 0 && (
                                        <p className="text-xs text-muted-foreground italic text-center py-4">No device data available</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Browsers List */}
                        <Card className="border-agency-accent/10">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold uppercase tracking-tight">Browser Usage</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {browserData.map((browser) => (
                                        <div key={browser.name} className="space-y-1">
                                            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                                                <span>{browser.name}</span>
                                                <span className="opacity-60">{Math.round((browser.value / totalViews) * 100)}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-agency-accent transition-all duration-1000"
                                                    {...{ style: { width: `${(browser.value / (totalViews || 1)) * 100}%` } }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    {browserData.length === 0 && (
                                        <p className="text-xs text-muted-foreground italic text-center py-4">No browser data available</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Top Pages Table */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-bold uppercase tracking-tight">Highest Traffic Pages</CardTitle>
                                <CardDescription className="italic font-medium">Pages receiving most views.</CardDescription>
                            </div>
                            <Globe className="h-5 w-5 text-agency-accent opacity-50" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {topPages.map((page, i) => (
                                    <div key={i} className="flex items-center justify-between group cursor-default">
                                        <div className="space-y-0.5 max-w-[70%]">
                                            <div className="text-sm font-bold truncate group-hover:text-agency-accent transition-colors tracking-tight">{page.url}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-black italic tracking-tighter">{page.count.toLocaleString()}</div>
                                        </div>
                                    </div>
                                ))}
                                {topPages.length === 0 && (
                                    <p className="text-xs text-muted-foreground italic text-center py-4">No page data available</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Referrer Sources */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl font-bold uppercase tracking-tight">Lead Sources</CardTitle>
                            <CardDescription className="italic font-medium">Where users are coming from.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {topReferrers.map((source, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between text-xs font-bold tracking-tight uppercase">
                                                <span>{source.referer || 'Direct'}</span>
                                                <span>{Math.round((source.count / totalViews) * 100)}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-agency-accent/40"
                                                    {...{ style: { width: `${(source.count / (totalViews || 1)) * 100}%` } }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {topReferrers.length === 0 && (
                                    <p className="text-xs text-muted-foreground italic text-center py-4">No source data available</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Stats/Summary */}
                    <Card className="bg-agency-accent text-white border-none shadow-xl shadow-agency-accent/20">
                        <CardHeader>
                            <CardTitle className="text-xl font-black uppercase italic tracking-tighter">Velocity Report</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <p className="text-xs font-bold uppercase tracking-widest opacity-80">Engagement Peak</p>
                                <p className="text-2xl font-black tracking-tighter">Tuesday, 3:45 PM</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-xs font-bold uppercase tracking-widest opacity-80">Conversion Strength</p>
                                <p className="text-2xl font-black tracking-tighter">8.4% Average</p>
                            </div>
                            <div className="pt-4 mt-4 border-t border-white/20">
                                <Button className="w-full bg-white text-agency-accent hover:bg-white/90 font-black uppercase italic italic">
                                    Export Full Intel
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
