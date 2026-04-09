<?php

namespace App\Services\Stats;

use App\Models\Festival;
use App\Models\Review;
use App\Models\User;
use App\Models\Insight;
use Illuminate\Support\Facades\Cache;
use Modules\PodcastPlugin\Models\Podcast;

class GlobalStatsService
{
    /**
     * Get platform-wide statistics for public-facing components.
     * Cached for 5 minutes.
     */
    public function getStats(): array
    {
        return Cache::remember('global_platform_stats', 300, function () {
            $approvedReviewsQuery = Review::approved();
            
            $totalReviews = $approvedReviewsQuery->count();
            $averageRating = round($approvedReviewsQuery->avg('vibe_rating') ?: 0, 1);
            
            // If we have no reviews, default to a sensible starting point for the UI
            // but return 0 if that's the "true state"
            $averageRating = $averageRating ?: 0;

            return [
                'reviews_total' => $totalReviews,
                'reviews_avg_rating' => $averageRating,
                'festivals_total' => Festival::count(),
                'podcasts_total' => class_exists(Podcast::class) ? Podcast::count() : 0,
                'insights_total' => Insight::published()->count(),
                'explorers_total' => User::count(), // Total registered users
                'last_updated' => now()->toIso8601String(),
            ];
        });
    }

    /**
     * Clear the stats cache.
     */
    public function clearCache(): void
    {
        Cache::forget('global_platform_stats');
    }
}
