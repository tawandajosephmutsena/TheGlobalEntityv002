<?php

namespace Modules\PodcastPlugin\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Modules\PodcastPlugin\Models\Podcast;
use Modules\PodcastPlugin\Models\PodcastCategory;

class PodcastAdminController extends Controller
{
    public function index(Request $request)
    {
        $query = Podcast::with(['category', 'author']);

        // Filter by status
        if ($request->filled('status')) {
            match ($request->status) {
                'published' => $query->where('is_published', true),
                'draft' => $query->where('is_published', false)->whereNull('published_at'),
                'scheduled' => $query->where('is_published', false)->whereNotNull('published_at')->where('published_at', '>', now()),
                default => null,
            };
        }

        // Filter by category
        if ($request->filled('category')) {
            $query->where('podcast_category_id', $request->category);
        }

        // Search
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        $podcasts = $query->latest()->paginate(15)->withQueryString();
        $categories = PodcastCategory::active()->orderBy('sort_order')->get();

        // Stats
        $stats = [
            'total' => Podcast::count(),
            'published' => Podcast::where('is_published', true)->count(),
            'drafts' => Podcast::where('is_published', false)->count(),
            'total_plays' => Podcast::sum('play_count'),
        ];

        return Inertia::render('admin/podcasts/Index', [
            'podcasts' => $podcasts,
            'categories' => $categories,
            'stats' => $stats,
            'filters' => $request->only(['status', 'category', 'search']),
        ]);
    }

    public function create()
    {
        $categories = PodcastCategory::active()->orderBy('sort_order')->get();

        return Inertia::render('admin/podcasts/Create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        Log::info("Podcast store hit", $request->all());
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:5000',
            'content' => 'nullable|string',
            'media_url' => 'required|string',
            'media_type' => 'required|in:audio,video',
            'thumbnail' => 'nullable|string',
            'podcast_category_id' => 'nullable|exists:podcast_categories,id',
            'season_number' => 'nullable|integer|min:1',
            'episode_number' => 'nullable|integer|min:1',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'is_published' => 'boolean',
            'published_at' => 'nullable|date',
            'duration' => 'nullable|numeric',
        ]);

        $podcast = Podcast::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'content' => $validated['content'] ?? null,
            'media_url' => $validated['media_url'],
            'media_type' => $validated['media_type'],
            'thumbnail' => $validated['thumbnail'] ?? null,
            'duration' => $validated['duration'] ?? 0,
            'file_size' => 0,
            'podcast_category_id' => $validated['podcast_category_id'] ?? null,
            'author_id' => Auth::id(),
            'season_number' => $validated['season_number'] ?? null,
            'episode_number' => $validated['episode_number'] ?? null,
            'tags' => $validated['tags'] ?? null,
            'is_published' => $validated['is_published'] ?? false,
            'published_at' => ($validated['is_published'] ?? false) ? ($validated['published_at'] ?? now()) : ($validated['published_at'] ?? null),
        ]);

        return redirect()->route('admin.podcasts.index')
            ->with('success', "Podcast \"{$podcast->title}\" created successfully.");
    }

    public function edit(int $id)
    {
        $podcast = Podcast::with(['category', 'author'])->findOrFail($id);
        $categories = PodcastCategory::active()->orderBy('sort_order')->get();

        return Inertia::render('admin/podcasts/Edit', [
            'podcast' => $podcast,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, int $id)
    {
        $podcast = Podcast::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:5000',
            'content' => 'nullable|string',
            'media_url' => 'required|string',
            'media_type' => 'required|in:audio,video',
            'thumbnail' => 'nullable|string',
            'podcast_category_id' => 'nullable|exists:podcast_categories,id',
            'season_number' => 'nullable|integer|min:1',
            'episode_number' => 'nullable|integer|min:1',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'is_published' => 'boolean',
            'published_at' => 'nullable|date',
            'duration' => 'nullable|numeric',
        ]);

        $podcast->fill([
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']),
            'description' => $validated['description'] ?? null,
            'content' => $validated['content'] ?? null,
            'media_url' => $validated['media_url'],
            'media_type' => $validated['media_type'],
            'thumbnail' => $validated['thumbnail'] ?? null,
            'podcast_category_id' => $validated['podcast_category_id'] ?? null,
            'season_number' => $validated['season_number'] ?? null,
            'episode_number' => $validated['episode_number'] ?? null,
            'tags' => $validated['tags'] ?? null,
            'is_published' => $validated['is_published'] ?? false,
            'published_at' => ($validated['is_published'] ?? false) ? ($validated['published_at'] ?? now()) : ($validated['published_at'] ?? null),
        ]);

        if (isset($validated['duration'])) {
            $podcast->duration = (int) $validated['duration'];
        }

        $podcast->save();

        return redirect()->route('admin.podcasts.index')
            ->with('success', "Podcast \"{$podcast->title}\" updated successfully.");
    }

    public function destroy(int $id)
    {
        $podcast = Podcast::findOrFail($id);

        // Delete associated files
        if ($podcast->media_url) {
            Storage::disk('public')->delete($podcast->media_url);
        }
        if ($podcast->thumbnail) {
            Storage::disk('public')->delete($podcast->thumbnail);
        }

        $podcast->delete();

        return redirect()->route('admin.podcasts.index')
            ->with('success', 'Podcast deleted successfully.');
    }

    public function togglePublished(int $id)
    {
        $podcast = Podcast::findOrFail($id);
        $podcast->is_published = !$podcast->is_published;

        if ($podcast->is_published && !$podcast->published_at) {
            $podcast->published_at = now();
        }

        $podcast->save();

        return back()->with('success', $podcast->is_published ? 'Podcast published.' : 'Podcast unpublished.');
    }

    public function toggleFeatured(int $id)
    {
        $podcast = Podcast::findOrFail($id);
        $podcast->is_featured = !$podcast->is_featured;
        $podcast->save();

        return back()->with('success', $podcast->is_featured ? 'Podcast featured.' : 'Podcast unfeatured.');
    }

    public function bulkAction(Request $request)
    {
        $request->validate([
            'action' => 'required|in:publish,unpublish,delete',
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:podcasts,id',
        ]);

        $podcasts = Podcast::whereIn('id', $request->ids);

        match ($request->action) {
            'publish' => $podcasts->update(['is_published' => true, 'published_at' => now()]),
            'unpublish' => $podcasts->update(['is_published' => false]),
            'delete' => $podcasts->each(function ($podcast) {
                if ($podcast->media_url) Storage::disk('public')->delete($podcast->media_url);
                if ($podcast->thumbnail) Storage::disk('public')->delete($podcast->thumbnail);
                $podcast->delete();
            }),
        };

        return back()->with('success', 'Bulk action completed.');
    }
}
