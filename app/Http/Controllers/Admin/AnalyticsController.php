<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Visit;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    /**
     * Display the analytics dashboard.
     */
    public function index(Request $request): Response
    {
        $range = $request->query('range', '30d');
        if ($range === '24h') {
            $days = 1;
        } else {
            $days = (int) str_replace('d', '', $range);
        }
        
        if (!in_array($days, [1, 7, 30, 90, 365])) {
            $days = 30;
        }

        $startDate = now()->subDays($days - 1)->startOfDay();
        $endDate = now()->endOfDay();

        // 1. Page views over time (Last $days days)
        $viewsOverTime = Visit::excludeBots()
            ->selectRaw('DATE(created_at) as date, count(*) as count')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->pluck('count', 'date');

        $uniquesOverTime = Visit::excludeBots()
            ->selectRaw('DATE(created_at) as date, count(distinct session_id) as count')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->pluck('count', 'date');

        $chartData = [];
        for ($i = 0; $i < $days; $i++) {
            $date = $startDate->clone()->addDays($i)->format('Y-m-d');
            $chartData[] = [
                'date' => $date,
                'views' => $viewsOverTime->get($date, 0),
                'unique' => $uniquesOverTime->get($date, 0)
            ];
        }

        // 2. Top Pages
        $topPages = Visit::excludeBots()
            ->select('url', DB::raw('count(*) as count'))
            ->groupBy('url')
            ->orderByDesc('count')
            ->limit(10)
            ->get();

        // 3. Top Referrers
        $topReferrers = Visit::excludeBots()
            ->whereNotNull('referer')
            ->select('referer', DB::raw('count(*) as count'))
            ->groupBy('referer')
            ->orderByDesc('count')
            ->limit(10)
            ->get();

        // 4. Device Breakdown
        $devicesQuery = Visit::excludeBots()
            ->selectRaw("
                CASE 
                    WHEN LOWER(user_agent) LIKE '%mobile%' OR LOWER(user_agent) LIKE '%android%' OR LOWER(user_agent) LIKE '%iphone%' THEN 'Mobile'
                    WHEN LOWER(user_agent) LIKE '%tablet%' OR LOWER(user_agent) LIKE '%ipad%' THEN 'Tablet'
                    ELSE 'Desktop'
                END as device_name,
                COUNT(*) as count
            ")
            ->groupBy('device_name')
            ->get();

        $deviceData = [];
        foreach ($devicesQuery as $device) {
            $deviceData[] = ['name' => $device->device_name, 'value' => $device->count];
        }

        // 5. Browser Breakdown
        $browsersQuery = Visit::excludeBots()
            ->selectRaw("
                CASE 
                    WHEN LOWER(user_agent) LIKE '%chrome%' THEN 'Chrome'
                    WHEN LOWER(user_agent) LIKE '%firefox%' THEN 'Firefox'
                    WHEN LOWER(user_agent) LIKE '%safari%' AND LOWER(user_agent) NOT LIKE '%chrome%' THEN 'Safari'
                    WHEN LOWER(user_agent) LIKE '%edge%' THEN 'Edge'
                    ELSE 'Other'
                END as browser_name,
                COUNT(*) as count
            ")
            ->groupBy('browser_name')
            ->get();

        $browserData = [];
        foreach ($browsersQuery as $browser) {
            $browserData[] = ['name' => $browser->browser_name, 'value' => $browser->count];
        }

        // 6. Interaction Density (Heatmap-ish)
        $topInteractions = \App\Models\Interaction::where('type', 'click')
            ->select('element_selector', DB::raw('count(*) as count'))
            ->groupBy('element_selector')
            ->orderByDesc('count')
            ->limit(5)
            ->get();

        // 7. Active Now (last 5 minutes)
        $activeNow = Visit::excludeBots()
            ->where('created_at', '>=', now()->subMinutes(5))
            ->distinct('session_id')
            ->count();

        $activePrev = Visit::excludeBots()
            ->whereBetween('created_at', [now()->subMinutes(10), now()->subMinutes(5)])
            ->distinct('session_id')
            ->count();
        $activeTrend = $activePrev > 0 ? round((($activeNow - $activePrev) / $activePrev) * 100, 1) : 0;

        // --- DYNAMIC TRENDS & BOUNCE RATE ---
        $prevStart = clone $startDate;
        $prevStart->subDays($days);
        $prevEnd = clone $endDate;
        $prevEnd->subDays($days);

        $currentVisits = Visit::excludeBots()->whereBetween('created_at', [$startDate, $endDate])->count();
        $prevVisits = Visit::excludeBots()->whereBetween('created_at', [$prevStart, $prevEnd])->count();
        $visitTrend = $prevVisits > 0 ? round((($currentVisits - $prevVisits) / $prevVisits) * 100, 1) : ($currentVisits > 0 ? 100 : 0);

        $currentUnique = Visit::excludeBots()->whereBetween('created_at', [$startDate, $endDate])->distinct('session_id')->count();
        $prevUnique = Visit::excludeBots()->whereBetween('created_at', [$prevStart, $prevEnd])->distinct('session_id')->count();
        $uniqueTrend = $prevUnique > 0 ? round((($currentUnique - $prevUnique) / $prevUnique) * 100, 1) : ($currentUnique > 0 ? 100 : 0);

        // Sessions Bounce Rate (Sessions with exactly 1 view)
        $bouncedCurrent = DB::table('visits')
            ->select(DB::raw('count(*) as count'))
            ->from(function ($query) use ($startDate, $endDate) {
                $query->from('visits')
                    ->select('session_id')
                    ->where('is_robot', false)
                    ->whereBetween('created_at', [$startDate, $endDate])
                    ->groupBy('session_id')
                    ->havingRaw('COUNT(id) = 1');
            }, 'derived')
            ->value('count') ?? 0;

        $bounceRate = $currentUnique > 0 ? round(($bouncedCurrent / $currentUnique) * 100, 1) : 0;

        $bouncedPrev = DB::table('visits')
            ->select(DB::raw('count(*) as count'))
            ->from(function ($query) use ($prevStart, $prevEnd) {
                $query->from('visits')
                    ->select('session_id')
                    ->where('is_robot', false)
                    ->whereBetween('created_at', [$prevStart, $prevEnd])
                    ->groupBy('session_id')
                    ->havingRaw('COUNT(id) = 1');
            }, 'derived')
            ->value('count') ?? 0;

        $bounceRatePrev = $prevUnique > 0 ? round(($bouncedPrev / $prevUnique) * 100, 1) : 0;
        $bounceTrend = $bounceRatePrev > 0 ? round((($bounceRate - $bounceRatePrev) / $bounceRatePrev) * 100, 1) : 0;

        // 8. Heatmap Data (Day of Week vs Hour)
        $heatmapData = \Illuminate\Support\Facades\Cache::remember("analytics_heatmap_{$range}", 60, function () use ($startDate, $endDate) {
            $data = Visit::excludeBots()
                ->whereBetween('created_at', [$startDate, $endDate])
                ->selectRaw("strftime('%w', created_at) as day, strftime('%H', created_at) as hour, count(*) as count")
                ->groupBy('day', 'hour')
                ->get();
            
            $formatted = [];
            foreach ($data as $item) {
                $formatted[] = [
                    'day' => (int) $item->day,
                    'hour' => (int) $item->hour,
                    'count' => (int) $item->count
                ];
            }
            return $formatted;
        });

        // 9. Interaction Intel (Top Clicked Elements)
        $interactionIntel = \Illuminate\Support\Facades\Cache::remember("analytics_interactions_{$range}", 60, function () use ($startDate, $endDate) {
            return \App\Models\Interaction::where('type', 'click')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->select('element_selector', \Illuminate\Support\Facades\DB::raw('count(*) as count'))
                ->groupBy('element_selector')
                ->orderByDesc('count')
                ->limit(10)
                ->get()
                ->map(function($i) {
                    // Try to make the selector more human readable
                    $label = str_replace(['#app > div', '.selection:', ' > '], ['', '', ' » '], $i->element_selector);
                    $label = strlen($label) > 60 ? '...' . substr($label, -60) : $label;
                    return [
                        'label' => $label ?: 'Unknown Element',
                        'count' => $i->count
                    ];
                });
        });

        // 10. Sparkline Data (Historical trends for cards)
        $sparklineData = [
            'visits' => $chartData, // Already per day
            'unique' => Visit::excludeBots()
                ->whereBetween('created_at', [$startDate, $endDate])
                ->selectRaw("DATE(created_at) as date, count(distinct session_id) as count")
                ->groupBy('date')
                ->orderBy('date')
                ->get()
                ->pluck('count')->toArray(),
        ];

        // Engagement Peak
        $visitsCurrent = Visit::excludeBots()
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get(['created_at']);
        
        $times = [];
        foreach ($visitsCurrent as $visit) {
            $key = $visit->created_at->format('l, g A');
            if (!isset($times[$key])) $times[$key] = 0;
            $times[$key]++;
        }
        arsort($times);
        $engagementPeak = empty($times) ? 'N/A' : array_key_first($times);

        // Conversion Rate
        $inquiries = \App\Models\ContactInquiry::whereBetween('created_at', [$startDate, $endDate])->count();
        $conversionRate = $currentUnique > 0 ? round(($inquiries / $currentUnique) * 100, 1) : 0;

        return Inertia::render('admin/Analytics', [
            'currentRange' => $range,
            'chartData' => $chartData,
            'topPages' => $topPages,
            'topReferrers' => $topReferrers,
            'deviceData' => $deviceData,
            'browserData' => $browserData,
            'topInteractions' => $topInteractions,
            'interactionIntel' => $interactionIntel,
            'heatmapData' => $heatmapData,
            'sparklineData' => $sparklineData,
            'activeNow' => $activeNow,
            'activeTrend' => $activeTrend,
            'totalVisits' => $currentVisits,
            'visitTrend' => $visitTrend,
            'uniqueVisitors' => $currentUnique,
            'uniqueTrend' => $uniqueTrend,
            'bounceRate' => $bounceRate,
            'bounceTrend' => $bounceTrend,
            'engagementPeak' => $engagementPeak,
            'conversionRate' => $conversionRate,
            'platformStats' => app(\App\Services\Dashboard\DashboardRegistry::class)->aggregateStats()
        ]);
    }

    public function export(Request $request)
    {
        $range = $request->get('range', '30d');
        $days = match($range) {
            '24h' => 1,
            '7d' => 7,
            '90d' => 90,
            '365d' => 365,
            default => 30
        };

        $startDate = now()->subDays($days)->startOfDay();
        $endDate = now()->endOfDay();

        $visits = Visit::excludeBots()
            ->whereBetween('created_at', [$startDate, $endDate])
            ->orderBy('created_at', 'desc')
            ->get();

        $fileName = "analytics_export_" . now()->format('Y-m-d') . ".csv";

        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$fileName",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $callback = function() use($visits) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['ID', 'Date', 'URL', 'Referer', 'Device', 'Browser', 'OS', 'IP Address', 'Country']);

            foreach ($visits as $visit) {
                fputcsv($file, [
                    $visit->id,
                    $visit->created_at->toDateTimeString(),
                    $visit->url,
                    $visit->referer,
                    $visit->device_type,
                    $visit->browser,
                    $visit->platform,
                    $visit->ip_address,
                    $visit->country_code,
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
