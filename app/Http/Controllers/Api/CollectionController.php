<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Carbon\Carbon;

class CollectionController extends Controller
{
    /**
     * Fetch items from a specified collection
     */
    public function index(Request $request, $collection)
    {
        $limit = $request->get('limit', 5);
        $data = [];

        switch ($collection) {
            case 'insights':
            case 'blog':
                $items = \App\Models\Insight::published()
                    ->with(['author', 'category'])
                    ->latest('published_at')
                    ->take($limit)
                    ->get();
                    
                $data = $items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'title' => $item->title,
                        'description' => $item->excerpt ?? strip_tags(substr($item->content['body'] ?? '', 0, 150)),
                        'category' => $item->category?->name ?? 'Article',
                        'image' => $item->featured_image ?: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
                        'author' => [
                            'name' => $item->author?->name ?? 'Admin',
                            'avatar' => $item->author?->avatar_url ?? 'https://github.com/shadcn.png'
                        ],
                        'date' => $item->published_at ? $item->published_at->format('M d, Y') : $item->created_at->format('M d, Y'),
                        'readTime' => $item->reading_time ? $item->reading_time . ' min read' : '5 min read',
                        'url' => route('blog.show', $item->slug),
                        'image_conversions' => $item->getOptimizedImage('featured_image'),
                    ];
                });
                break;

            case 'portfolio':
                $items = \App\Models\PortfolioItem::published()
                    ->with('category')
                    ->latest()
                    ->take($limit)
                    ->get();
                    
                $data = $items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'title' => $item->title,
                        'description' => $item->description ?? $item->client ?? '',
                        'category' => $item->category?->name ?? 'Project',
                        'image' => $item->featured_image ?: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80',
                        'author' => [
                            'name' => 'Portfolio',
                            'avatar' => 'https://github.com/shadcn.png'
                        ],
                        'date' => $item->project_date ? Carbon::parse($item->project_date)->format('M d, Y') : $item->created_at->format('M d, Y'),
                        'readTime' => 'View Project',
                        'url' => route('portfolio.show', $item->slug),
                        'image_conversions' => $item->getOptimizedImage('featured_image'),
                    ];
                });
                break;

            case 'services':
                $items = \App\Models\Service::published()
                    ->latest()
                    ->take($limit)
                    ->get();
                    
                $data = $items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'title' => $item->title,
                        'description' => $item->excerpt ?? strip_tags(substr($item->description ?? '', 0, 150)),
                        'category' => 'Service',
                        'image' => $item->featured_image ?: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&q=80',
                        'author' => [
                            'name' => 'Service',
                            'avatar' => 'https://github.com/shadcn.png'
                        ],
                        'date' => $item->created_at->format('M d, Y'),
                        'readTime' => 'Learn More',
                        'url' => route('services.show', $item->slug),
                        'image_conversions' => $item->getOptimizedImage('featured_image'),
                    ];
                });
                break;
                
            case 'festivals':
                $items = \App\Models\Festival::published()
                    ->when($request->has('ids'), function ($query) use ($request) {
                        $ids = explode(',', $request->get('ids'));
                        return $query->whereIn('id', $ids);
                    })
                    ->when(!$request->has('ids') && $request->has('featured'), function ($query) {
                        return $query->where('is_featured', true);
                    })
                    ->with(['author', 'category', 'activities'])
                    ->withAvg(['reviews' => fn($query) => $query->where('status', 'approved')], 'vibe_rating')
                    ->withCount(['reviews' => fn($query) => $query->where('status', 'approved')])
                    ->latest()
                    ->when(!$request->has('ids'), function ($query) use ($limit) {
                        return $query->take($limit);
                    })
                    ->get();
                    
                $data = $items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'title' => $item->name,
                        'description' => $item->description ?? '',
                        'category' => $item->category?->name ?? 'Festival',
                        'image' => $item->image ?: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800',
                        'author' => [
                            'name' => $item->author?->name ?? 'Admin',
                            'avatar' => $item->author?->avatar_url ?? 'https://github.com/shadcn.png'
                        ],
                        'date' => $item->start_date ? $item->start_date->format('M d, Y') : '',
                        'readTime' => $item->location['address'] ?? 'Multiple Locations',
                        'url' => route('festivals.show', $item->slug),
                        'location' => $item->location,
                        'social_tags' => $item->social_tags ?? [],
                        'gallery' => $item->gallery ?? [],
                        'activities' => $item->activities->pluck('name')->toArray(),
                        'rating' => $item->reviews_avg_vibe_rating ? round($item->reviews_avg_vibe_rating, 1) : null,
                        'review_count' => $item->reviews_count ?? 0,
                        'image_conversions' => $item->getOptimizedImage('image'),
                    ];
                });
                break;

            case 'podcasts':
                if (class_exists('\Modules\PodcastPlugin\Models\Podcast')) {
                    $items = \Modules\PodcastPlugin\Models\Podcast::published()
                        ->when($request->has('featured'), function ($query) {
                            return $query->where('is_featured', true);
                        })
                        ->with(['author', 'category', 'podcastCategory'])
                        ->latest('published_at')
                        ->take($limit)
                        ->get();
                        
                    $data = $items->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'title' => $item->title,
                            'description' => $item->description ?? '',
                            'category' => $item->podcastCategory?->name ?? $item->category?->name ?? 'Podcast',
                            'image' => $item->thumbnail_url ?: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=80',
                            'author' => [
                                'name' => $item->author?->name ?? 'Host',
                                'avatar' => $item->author?->avatar_url ?? 'https://github.com/shadcn.png'
                            ],
                            'date' => $item->published_at ? $item->published_at->format('M d, Y') : '',
                            'readTime' => $item->formatted_duration ?? '30 min',
                            'url' => route('podcasts.show', $item->slug),
                            'thumbnail_url' => $item->thumbnail_url,
                            'image_conversions' => $item->getOptimizedImage('thumbnail'),
                        ];
                    });
                }
                break;

            case 'reviews':
                $query = \App\Models\Review::query()->approved();
                
                if ($request->has('featured') && $request->featured == 1) {
                    $query->latest();
                }

                $items = $query->with(['user', 'reviewable'])
                    ->latest()
                    ->take($limit)
                    ->get();
                    
                $data = $items->map(function ($item) {
                    $reviewable = $item->reviewable;
                    $eventName = 'Platform Event';
                    
                    if ($reviewable) {
                        $eventName = $reviewable->getAttribute('name') 
                            ?? $reviewable->getAttribute('title') 
                            ?? $eventName;
                    }

                    return [
                        'id' => $item->id,
                        'title' => $eventName,
                        'description' => $item->body ?? '',
                        'category' => 'Rating: ' . ($item->vibe_rating ?? 5) . '/5',
                        'image' => $item->user?->avatar_url ?? 'https://github.com/shadcn.png',
                        'author' => [
                            'name' => $item->user?->name ?? 'Anonymous',
                            'avatar' => $item->user?->avatar_url ?? 'https://github.com/shadcn.png'
                        ],
                        'date' => $item->created_at->format('M d, Y'),
                        'readTime' => 'Verified Review',
                        'url' => '#',
                    ];
                });
                break;
                
            default:
                // Fallback empty data if collection is not found
                $data = [];
                break;
        }

        return response()->json(['data' => $data]);
    }

    /**
     * Fetch a single item from a collection by ID
     */
    public function show(Request $request, $collection, $id)
    {
        $item = null;
        $data = null;

        switch ($collection) {
            case 'insights':
            case 'blog':
                $item = \App\Models\Insight::published()
                    ->with(['author', 'category', 'additionalCategories', 'podcast', 'festival'])
                    ->find($id);
                
                if ($item) {
                    $data = [
                        'id' => $item->id,
                        'title' => $item->title,
                        'description' => $item->excerpt ?? strip_tags(substr($item->getContentBody(), 0, 150)),
                        'category' => $item->category?->name ?? 'Article',
                        'image' => $item->featured_image ?: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
                        'author' => [
                            'name' => $item->author?->name ?? 'Admin',
                            'avatar' => $item->author?->avatar_url ?? 'https://github.com/shadcn.png'
                        ],
                        'date' => $item->published_at ? $item->published_at->format('M d, Y') : $item->created_at->format('M d, Y'),
                        'readTime' => $item->reading_time ? $item->reading_time . ' min read' : '5 min read',
                        'url' => route('blog.show', $item->slug),
                        'podcast' => $item->podcast ? [
                            'media_url' => $item->podcast->media_full_url,
                            'media_type' => $item->podcast->media_type,
                            'title' => $item->podcast->title,
                            'thumbnail' => $item->podcast->thumbnail_url,
                            'duration' => $item->podcast->formatted_duration,
                        ] : null,
                    ];
                }
                break;

            case 'festivals':
                $item = \App\Models\Festival::published()->with(['author', 'category', 'activities'])->find($id);
                if ($item) {
                    $data = [
                        'id' => $item->id,
                        'title' => $item->name,
                        'description' => $item->description ?? '',
                        'category' => $item->category?->name ?? 'Festival',
                        'image' => $item->image ?: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800',
                        'date' => $item->start_date ? $item->start_date->format('M d, Y') : '',
                        'locationAddress' => $item->location['address'] ?? 'Multiple Locations',
                        'url' => route('festivals.show', $item->slug),
                        'host' => $item->author?->name ?? 'Wildroots Collective',
                        'tags' => $item->social_tags ?? [],
                        'activities' => $item->activities->pluck('name')->toArray(),
                    ];
                }
                break;

            case 'podcasts':
                if (class_exists('\Modules\PodcastPlugin\Models\Podcast')) {
                    $item = \Modules\PodcastPlugin\Models\Podcast::with(['podcastCategory', 'author'])->published()->find($id);
                    if ($item) {
                        $data = [
                            'id' => $item->id,
                            'title' => $item->title,
                            'slug' => $item->slug,
                            'media_url' => $item->media_full_url,
                            'media_type' => $item->media_type,
                            'thumbnail_url' => $item->thumbnail_url,
                            'duration' => $item->formatted_duration,
                            'url' => route('podcasts.show', $item->slug),
                        ];
                    }
                }
                break;
        }

        if (!$data) {
            return response()->json(['error' => 'Item not found'], 404);
        }

        return response()->json(['data' => $data]);
    }

}
