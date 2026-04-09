<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PortfolioItem;
use App\Models\Service;
use App\Models\Insight;
use App\Models\TeamMember;
use App\Models\MediaAsset;
use App\Models\User;
use App\Models\ContactInquiry;
use App\Models\Page;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    /**
     * Display the admin dashboard with overview statistics and quick actions.
     */
    public function dashboard(\App\Services\Dashboard\DashboardRegistry $registry): \Inertia\Response
    {
        $pagesNeedingAttention = \App\Models\Insight::where('is_published', true)->whereNull('excerpt')->count() +
            \App\Models\Page::where('is_published', true)->whereNull('description')->count();
        $totalPages = \App\Models\Insight::where('is_published', true)->count() + \App\Models\Page::where('is_published', true)->count();
        $averageScore = $totalPages > 0 ? round(100 - (($pagesNeedingAttention / $totalPages) * 100)) : 100;

        return Inertia::render('admin/Dashboard', [
            'sources' => $registry->aggregateStats(),
            'recent_activity' => $registry->aggregateRecentActivity(),
            'content_distribution' => $registry->aggregateDistribution(),
            'content_timeline' => $registry->aggregateTimeline(),
            'next_update_timestamp' => $registry->getNextUpdateTimestamp(),
            'seo_stats' => [
                'average_score' => $averageScore,
                'pages_needing_attention' => $pagesNeedingAttention,
                'total_pages' => $totalPages,
            ],
        ]);
    }

    /**
     * Get quick action data for dashboard widgets.
     */
    public function quickActions(\App\Services\Dashboard\DashboardRegistry $registry)
    {
        return response()->json([
            'actions' => $registry->aggregateQuickActions(),
        ]);
    }
}