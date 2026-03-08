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
                
            default:
                // Fallback empty data if collection is not found
                $data = [];
                break;
        }

        return response()->json(['data' => $data]);
    }
}
