<?php

namespace Modules\PodcastPlugin\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\PodcastPlugin\Models\Podcast;
use Modules\PodcastPlugin\Models\PodcastCategory as Category;
use Modules\PodcastPlugin\Models\PodcastPlay;

class PodcastPublicController extends Controller
{
    public function index(Request $request)
    {
        $query = Podcast::with(['podcastCategory', 'author'])->published();

        // Search
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        // Category filter
        if ($request->filled('category')) {
            $categorySlug = $request->category;
            $query->whereHas('podcastCategory', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug);
            });
        }

        $perPage = config('podcastplugin.episodes_per_page', 12);

        $podcasts = $query->latest('published_at')->paginate($perPage)->withQueryString();
        $featured = Podcast::with(['podcastCategory'])->published()->featured()->latest('published_at')->take(3)->get();
        
        $categories = Category::active()
            ->withCount(['podcasts' => function ($q) {
                $q->published();
            }])
            ->whereHas('podcasts', function ($q) {
                $q->published();
            })
            ->orderBy('sort_order')
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
        $podcast = Podcast::with(['podcastCategory', 'author'])
            ->published()
            ->where('slug', $slug)
            ->firstOrFail();

        $related = Podcast::with(['podcastCategory'])
            ->published()
            ->where('id', '!=', $podcast->id)
            ->where(function ($q) use ($podcast) {
                if ($podcast->podcast_category_id) {
                    $q->where('podcast_category_id', $podcast->podcast_category_id);
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
            $categories = Category::active()
                ->withCount(['podcasts' => fn ($q) => $q->published()])
                ->whereHas('podcasts', fn ($q) => $q->published())
                ->orderBy('sort_order')
                ->get();
            return response()->json(['categories' => $categories]);
        }

        $term = $request->input('q', '');
        $limit = $request->input('limit', 10);
        $categorySlug = $request->input('category');
        $slug = $request->input('slug');

        $query = Podcast::with(['podcastCategory', 'author'])->published();

        if ($slug) {
            $query->where('slug', $slug);
        }

        if (strlen($term) >= 2) {
            $query->search($term);
        }

        if ($categorySlug) {
            $query->whereHas('podcastCategory', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug);
            });
        }

        // Only return specific fields if it's a typeahead search
        if ($request->has('q') && !$request->has('limit')) {
            $results = $query->latest('published_at')
                ->take(10)
                ->get(['id', 'title', 'slug', 'thumbnail_url', 'media_type', 'duration', 'podcast_category_id']);
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
