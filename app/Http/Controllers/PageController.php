<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PageController extends Controller
{
    public function show($slug)
    {
        $page = Page::published()
            ->where('slug', $slug)
            ->firstOrFail();

        // Fetch collections for dynamic blocks
        $featuredServices = \App\Models\Service::orderBy('sort_order')->take(10)->get();
        $featuredProjects = \App\Models\PortfolioItem::orderBy('sort_order')->take(10)->get();
        
        $insightsQuery = \App\Models\Insight::published()
            ->with(['author', 'category', 'additionalCategories', 'podcast', 'festival'])
            ->orderBy('published_at', 'desc');

        // If it's the journal/blog page, we might want real pagination
        if (in_array($slug, ['journal', 'blog', 'insights'])) {
            $recentInsights = $insightsQuery->get(); // Load all for "Show More" functionality in blocks
        } else {
            $recentInsights = $insightsQuery->take(10)->get();
        }

        $teamMembers = \App\Models\TeamMember::active()->ordered()->get();
        
        $reviews = \App\Models\Review::approved()->with('user')->latest()->take(20)->get()->map(function ($review) {
            return [
                'id' => $review->id,
                'user' => $review->user->name ?? 'Anonymous',
                'body' => $review->body,
                'vibe' => $review->vibe_rating,
                'safety' => $review->safety_rating,
                'sustainability' => $review->sustainability_rating,
                'date' => $review->created_at->diffForHumans(),
            ];
        });

        return Inertia::render('DynamicPage', [
            'page' => $page,
            'featuredServices' => $featuredServices,
            'featuredProjects' => $featuredProjects,
            'recentInsights' => $recentInsights,
            'teamMembers' => $teamMembers,
            'reviews' => $reviews,
        ]);
    }
}
