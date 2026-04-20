<?php

namespace App\Http\Controllers\Reviewer;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Festival;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the reviewer dashboard with a focus on recent site feedback and reviews.
     */
    public function index(Request $request): Response
    {
        // Recent reviews across all reviewable items (festivals)
        $reviews = Review::with(['reviewable', 'user'])
            ->latest()
            ->paginate(10);

        // Transform the collection for the frontend
        $reviews->getCollection()->transform(function ($review) {
            $averageRating = ($review->vibe_rating + $review->safety_rating + $review->sustainability_rating) / 3;
            
            return [
                'id' => $review->id,
                'rating' => round($averageRating, 1),
                'comment' => $review->body,
                'created_at' => $review->created_at,
                'user' => [
                    'name' => $review->user?->name ?? 'Anonymous',
                ],
                'festival' => [
                    'name' => $review->reviewable?->name ?? 'Unknown item',
                    'slug' => $review->reviewable?->slug ?? '#',
                ],
            ];
        });

        // Stats for the reviewer
        $stats = [
            'total_global_reviews' => Review::count(),
            'total_festivals' => Festival::where('is_published', true)->count(),
            'pending_audit' => 0, // Placeholder for future audit feature
        ];

        return Inertia::render('reviewer/Dashboard', [
            'reviews' => $reviews,
            'stats' => $stats,
        ]);
    }
}
