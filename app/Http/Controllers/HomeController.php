<?php

namespace App\Http\Controllers;

use App\Models\PortfolioItem;
use App\Models\Service;
use App\Models\Insight;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Display the homepage with featured content
     */
    public function index(): Response
    {
        $homePage = \App\Models\Page::where('slug', 'home')->first();

        // Fetch featured projects (no relationships, client/technologies are columns)
        $featuredProjects = PortfolioItem::where('is_featured', true)
            ->where('is_published', true)
            ->latest()
            ->take(3)
            ->get();

        // Fetch featured services (no category relationship)
        $featuredServices = Service::where('is_featured', true)
            ->where('is_published', true)
            ->latest()
            ->take(3)
            ->get();

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

        return Inertia::render('Home', [
            'page' => $homePage,
            'featuredProjects' => $featuredProjects,
            'featuredServices' => $featuredServices,
            'reviews' => $reviews,
            'recentInsights' => Inertia::defer(fn () => Insight::where('is_published', true)
                ->with(['author', 'category'])
                ->latest('published_at')
                ->take(3)
                ->get()),
            'stats' => Inertia::defer(fn () => [
                'projects_completed' => PortfolioItem::where('is_published', true)->count(),
                'services_offered' => Service::where('is_published', true)->count(),
                'insights_published' => Insight::where('is_published', true)->count(),
                'years_experience' => 5,
            ]),
            'canRegister' => \Laravel\Fortify\Features::enabled(\Laravel\Fortify\Features::registration()),
        ]);
    }
}