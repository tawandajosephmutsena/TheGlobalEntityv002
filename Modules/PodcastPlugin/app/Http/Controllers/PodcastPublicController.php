<?php

namespace Modules\PodcastPlugin\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\PodcastPlugin\Models\Podcast;
use App\Models\Category;
use Modules\PodcastPlugin\Models\PodcastPlay;

class PodcastPublicController extends Controller
{
    public function index(Request $request)
    {
        $query = Podcast::with(['category', 'categories', 'author'])->published();

        // Search
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        // Category filter
        if ($request->filled('category')) {
            $categorySlug = $request->category;
            $query->where(function ($q) use ($categorySlug) {
                $q->whereHas('category', function ($sq) use ($categorySlug) {
                    $sq->where('slug', $categorySlug);
                })->orWhereHas('categories', function ($sq) use ($categorySlug) {
                    $sq->where('slug', $categorySlug);
                });
            });
        }

        $perPage = config('podcastplugin.episodes_per_page', 12);

        $podcasts = $query->latest('published_at')->paginate($perPage)->withQueryString();
        $featured = Podcast::with(['category', 'categories'])->published()->featured()->latest('published_at')->take(3)->get();
        
        $categories = Category::where('type', 'insight')
            ->withCount(['podcasts' => function ($q) {
                $q->published();
            }])
            ->whereHas('podcasts', function ($q) {
                $q->published();
            })
            ->orderBy('name')
            ->get();

        return Inertia::render('Podcasts', [
            'podcasts' => $podcasts,
            'featured' => $featured,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    public function show(string $slug)
    {
        $podcast = Podcast::with(['category', 'categories', 'author'])
            ->published()
            ->where('slug', $slug)
            ->firstOrFail();

        $related = Podcast::with(['category', 'categories'])
            ->published()
            ->where('id', '!=', $podcast->id)
            ->where(function ($q) use ($podcast) {
                if ($podcast->category_id) {
                    $q->where('category_id', $podcast->category_id);
                }
                $categoryIds = $podcast->categories->pluck('id')->toArray();
                if (!empty($categoryIds)) {
                    $q->orWhereHas('categories', function ($sq) use ($categoryIds) {
                        $sq->whereIn('categories.id', $categoryIds);
                    });
                }
            })
            ->latest('published_at')
            ->take(4)
            ->get();

        return Inertia::render('Podcasts/Show', [
            'podcast' => $podcast,
            'related' => $related,
        ]);
    }

    public function trackPlay(Request $request, int $id)
    {
        $podcast = Podcast::findOrFail($id);

        PodcastPlay::create([
            'podcast_id' => $podcast->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'played_at' => now(),
            'duration_listened' => $request->input('duration_listened', 0),
        ]);

        $podcast->incrementPlayCount();

        return response()->json(['success' => true, 'play_count' => $podcast->fresh()->play_count]);
    }

    public function search(Request $request)
    {
        // Handle categories request for the grid block
        if ($request->boolean('categories')) {
            $categories = Category::where('type', 'insight')
                ->withCount(['podcasts' => fn ($q) => $q->published()])
                ->whereHas('podcasts', fn ($q) => $q->published())
                ->orderBy('name')
                ->get();
            return response()->json(['categories' => $categories]);
        }

        $term = $request->input('q', '');
        $limit = $request->input('limit', 10);
        $categorySlug = $request->input('category');
        $slug = $request->input('slug');

        $query = Podcast::with(['category', 'categories', 'author'])->published();

        if ($slug) {
            $query->where('slug', $slug);
        }

        if (strlen($term) >= 2) {
            $query->search($term);
        }

        if ($categorySlug) {
            $query->where(function ($q) use ($categorySlug) {
                $q->whereHas('category', function ($sq) use ($categorySlug) {
                    $sq->where('slug', $categorySlug);
                })->orWhereHas('categories', function ($sq) use ($categorySlug) {
                    $sq->where('slug', $categorySlug);
                });
            });
        }

        // Only return specific fields if it's a typeahead search
        if ($request->has('q') && !$request->has('limit')) {
            $results = $query->latest('published_at')
                ->take(10)
                ->get(['id', 'title', 'slug', 'thumbnail_url', 'media_type', 'duration', 'category_id']);
        } else {
            // Otherwise, get full models for the grid and attach formatted data via resources/appends 
            $results = $query->latest('published_at')
                ->take((int)$limit)
                ->get()
                ->append(['media_full_url', 'formatted_duration', 'formatted_file_size']);
        }

        return response()->json(['data' => $results]);
    }
}
