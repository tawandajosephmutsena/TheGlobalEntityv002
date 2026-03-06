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
    public function index(): Response
    {
        $days = 30;
        $startDate = now()->subDays($days - 1)->startOfDay();
        $endDate = now()->endOfDay();

        // 1. Page views over time (Last 30 days)
        $viewsOverTime = Visit::excludeBots()
            ->selectRaw('DATE(created_at) as date, count(*) as count')
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
                'views' => $viewsOverTime->get($date, 0)
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

        // 8. Festival Stats
        $totalFestivals = \App\Models\Festival::count();
        $upcomingFestivals = \App\Models\Festival::where('start_date', '>', now())->count();
        $totalReviews = \App\Models\Review::count();
        $pendingReviews = \App\Models\Review::where('status', 'pending')->count();

        return Inertia::render('admin/Analytics', [
            'chartData' => $chartData,
            'topPages' => $topPages,
            'topReferrers' => $topReferrers,
            'deviceData' => $deviceData,
            'browserData' => $browserData,
            'topInteractions' => $topInteractions,
            'activeNow' => $activeNow,
            'totalVisits' => Visit::excludeBots()->count(),
            'uniqueVisitors' => Visit::excludeBots()->distinct('session_id')->count(),
            'festivalStats' => [
                'total' => $totalFestivals,
                'upcoming' => $upcomingFestivals,
                'reviews' => $totalReviews, // Match Analytics.tsx expectations
                'pending' => $pendingReviews,
            ],
        ]);
    }
}
