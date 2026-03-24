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
                    ];
                });
                break;
                
            case 'festivals':
                $items = \App\Models\Festival::where('is_published', true)
                    ->when($request->has('ids'), function ($query) use ($request) {
                        $ids = explode(',', $request->get('ids'));
                        return $query->whereIn('id', $ids);
                    })
                    ->when(!$request->has('ids') && $request->has('featured'), function ($query) {
                        return $query->where('is_featured', true);
                    })
                    ->with(['author', 'category', 'activities'])
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
                        'locationAddress' => $item->location['address'] ?? 'Multiple Locations',
                        'url' => route('festivals.show', $item->slug),
                        'location' => $item->location,
                        'social_tags' => $item->social_tags ?? [],
                        'gallery' => $item->gallery ?? [],
                        'activities' => $item->activities->pluck('name')->toArray(),
                    ];
                });
                break;

            case 'podcasts':
                if (class_exists('\Modules\PodcastPlugin\Models\Podcast')) {
                    $items = \Modules\PodcastPlugin\Models\Podcast::published()
                        ->when($request->has('featured'), function ($query) {
                            return $query->where('is_featured', true);
                        })
                        ->with(['author', 'category'])
                        ->latest('published_at')
                        ->take($limit)
                        ->get();
                        
                    $data = $items->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'title' => $item->title,
                            'slug' => $item->slug,
                            'description' => $item->description ?? '',
                            'category' => ['name' => $item->category?->name ?? 'Podcast'],
                            'thumbnail_url' => $item->thumbnail_url,
                            'duration' => $item->formatted_duration,
                            'published_at' => $item->published_at ? $item->published_at->toIso8601String() : '',
                            'url' => route('podcasts.show', $item->slug),
                        ];
                    });
                }
                break;

            case 'reviews':
                $query = \App\Models\Review::query()->approved();
                
                // Note: Review model doesn't have is_featured yet, so we just filter by approved
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
                        // Safely get name or title without triggering MissingAttributeException
                        $eventName = $reviewable->getAttribute('name') 
                            ?? $reviewable->getAttribute('title') 
                            ?? $eventName;
                    }

                    return [
                        'id' => $item->id,
                        'author' => [
                            'name' => $item->user?->name ?? 'Anonymous',
                            'avatar' => $item->user?->avatar_url ?? 'https://github.com/shadcn.png'
                        ],
                        'rating' => $item->vibe_rating ?? 5,
                        'content' => $item->body ?? '',
                        'event_name' => $eventName,
                        'role' => 'Community Member',
                        'image' => $item->user?->avatar_url ?? 'https://github.com/shadcn.png'
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
}
