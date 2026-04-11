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

        // Fetch collections efficiently only if dynamic blocks are present
        $blocks = collect($page->content['blocks'] ?? []);
        $hasBlock = fn($type) => $blocks->contains('type', $type);

        $featuredServices = $hasBlock('services') || $hasBlock('apple_cards_carousel') || $hasBlock('creative_grid')
            ? \App\Models\Service::with('category')->orderBy('sort_order')->take(10)->get()
            : [];

        $featuredProjects = $hasBlock('portfolio') || $hasBlock('apple_cards_carousel') || $hasBlock('creative_grid')
            ? \App\Models\PortfolioItem::with('category')->orderBy('sort_order')->take(10)->get()
            : [];
        
        $recentInsights = [];
        if ($hasBlock('insights') || $hasBlock('apple_cards_carousel') || $hasBlock('creative_grid') || $hasBlock('journal_hero') || $hasBlock('journal_article_grid') || in_array($slug, ['journal', 'blog', 'insights'])) {
             $insightsQuery = \App\Models\Insight::published()
                ->with(['author', 'category', 'additionalCategories', 'podcast', 'festival'])
                ->orderBy('published_at', 'desc');

            if (in_array($slug, ['journal', 'blog', 'insights'])) {
                $recentInsights = $insightsQuery->get();
            } else {
                $recentInsights = $insightsQuery->take(10)->get();
            }
        }

        $teamMembers = $hasBlock('team_grid')
            ? \App\Models\TeamMember::active()->ordered()->get()
            : [];
        
        $reviews = [];
        if ($hasBlock('community_review')) {
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
        }

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
