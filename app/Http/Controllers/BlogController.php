<?php

namespace App\Http\Controllers;

use App\Models\Insight;
use App\Models\Category;
use App\Models\Page;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    /**
     * Display a listing of the blog posts.
     */
    public function index(Request $request): Response
    {
        $page = $request->get('page', 1);
        $category = $request->get('category', 'all');
        $search = $request->get('search', '');
        
        $version = \Illuminate\Support\Facades\Cache::get('blog.cache_version', 1);
        $cacheKey = "blog.index.{$version}.{$page}.{$category}.{$search}";

        $insights = \Illuminate\Support\Facades\Cache::flexible($cacheKey, [60 * 60, 60 * 60 * 2], function () use ($request) {
            $query = Insight::published()
                ->with(['author:id,name,avatar', 'category:id,name,slug,icon', 'additionalCategories:id,name,slug,icon', 'podcast:id,title,slug', 'festival:id,name,slug']);

            if ($request->filled('category') && $request->category !== 'all') {
                $query->where(function ($q) use ($request) {
                    $q->whereHas('category', function ($subQ) use ($request) {
                        $subQ->where('slug', $request->category)
                             ->orWhere('categories.id', $request->category);
                    })->orWhereHas('additionalCategories', function ($subQ) use ($request) {
                        $subQ->where('slug', $request->category)
                             ->orWhere('categories.id', $request->category);
                    });
                });
            }

            if ($request->filled('search')) {
                $query->where(function ($q) use ($request) {
                    $q->where('title', 'like', '%' . $request->search . '%')
                      ->orWhere('excerpt', 'like', '%' . $request->search . '%');
                });
            }

            return $query->orderBy('published_at', 'desc')
                ->paginate(9);
        });

        $categories = \Illuminate\Support\Facades\Cache::flexible('blog.categories', [60 * 60 * 24, 60 * 60 * 48], function () {
            return Category::where('type', 'insight')->get(['id', 'name', 'slug', 'icon']);
        });

        $dynamicPage = Page::published()->where('slug', 'blog')->first();

        return Inertia::render('Blog', [
            'insights' => $insights,
            'categories' => $categories,
            'filters' => $request->only(['category', 'search']),
            'page' => $dynamicPage,
        ]);
    }

    /**
     * Display the specified blog post.
     */
    public function show(string $slug): Response
    {
        $insight = Insight::published()
            ->with(['author:id,name,avatar', 'category', 'additionalCategories', 'podcast', 'festival'])
            ->where('slug', $slug)
            ->firstOrFail();

        // Load top-level approved comments with nested replies, users, and reactions
        $comments = $insight->comments()
            ->approved()
            ->topLevel()
            ->with(['user:id,name,avatar', 'replies.user:id,name,avatar', 'replies.reactions', 'reactions'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Load reaction counts for the insight
        $reactionCounts = $insight->reactions()
            ->selectRaw('type, count(*) as count')
            ->groupBy('type')
            ->pluck('count', 'type')
            ->toArray();

        // Get the current user's reaction on the insight (if logged in)
        $userReaction = null;
        if (auth()->check()) {
            $userReaction = $insight->reactions()
                ->where('user_id', auth()->id())
                ->value('type');
        }

        $relatedInsights = Insight::published()
            ->where('id', '!=', $insight->id)
            ->where('category_id', $insight->category_id)
            ->limit(3)
            ->get();

        return Inertia::render('Blog/Show', [
            'insight' => $insight,
            'comments' => $comments,
            'reactionCounts' => $reactionCounts,
            'userReaction' => $userReaction,
            'relatedInsights' => $relatedInsights,
        ]);
    }
}
