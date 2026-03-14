<?php

namespace App\Http\Controllers;

use App\Models\Festival;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FestivalController extends Controller
{
    /**
     * Display the specified festival.
     */
    public function show($slug)
    {
        $festival = Festival::where('slug', $slug)
            ->where('is_published', true)
            ->with(['author', 'category', 'activities', 'reviews.user'])
            ->firstOrFail();

        return Inertia::render('festivals/Show', [
            'festival' => [
                'id' => $festival->id,
                'title' => $festival->name,
                'description' => $festival->description,
                'category' => $festival->category?->name ?? 'Festival',
                'image' => $festival->image,
                'gallery' => $festival->gallery ?? [],
                'date' => $festival->start_date ? $festival->start_date->format('M d, Y') : '',
                'end_date' => $festival->end_date ? $festival->end_date->format('M d, Y') : '',
                'location' => $festival->location, // Contains address, lat, lng
                'activities' => $festival->activities->pluck('name')->toArray(),
                'social_tags' => $festival->social_tags ?? [],
                'author' => [
                    'name' => $festival->author?->name ?? 'Admin',
                    'avatar' => $festival->author?->avatar_url ?? 'https://github.com/shadcn.png'
                ],
                'reviews' => $festival->reviews->map(fn($review) => [
                    'id' => $review->id,
                    'user' => [
                        'name' => $review->user->name,
                        'avatar' => $review->user->avatar_url ?? 'https://github.com/shadcn.png',
                    ],
                    'body' => $review->body,
                    'vibe_rating' => $review->vibe_rating,
                    'safety_rating' => $review->safety_rating,
                    'sustainability_rating' => $review->sustainability_rating,
                    'date' => $review->created_at->diffForHumans(),
                ]),
            ]
        ]);
    }
}
