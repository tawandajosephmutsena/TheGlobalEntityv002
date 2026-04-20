<?php

namespace Modules\PodcastPlugin\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Response;
use Modules\PodcastPlugin\Models\PodcastCategory;
use Modules\PodcastPlugin\Models\Podcast;
use Illuminate\Support\Facades\Storage;

class PodcastFeedController extends Controller
{
    public function show(string $slug): Response
    {
        $category = PodcastCategory::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        $podcasts = Podcast::where('podcast_category_id', $category->id)
            ->where('is_published', true)
            ->whereNotNull('media_url')
            ->orderBy('published_at', 'desc')
            ->get();

        $xml = view('podcastplugin::rss', [
            'category' => $category,
            'podcasts' => $podcasts,
        ])->render();

        return response($xml, 200)
            ->header('Content-Type', 'application/rss+xml; charset=utf-8');
    }
}
