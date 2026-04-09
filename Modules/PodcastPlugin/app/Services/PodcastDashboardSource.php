<?php

namespace Modules\PodcastPlugin\Services;

use App\Services\Dashboard\BaseDashboardSource;
use Modules\PodcastPlugin\Models\Podcast;

class PodcastDashboardSource extends BaseDashboardSource
{
    protected function getModelClass(): string
    {
        return Podcast::class;
    }

    public function getKey(): string
    {
        return 'podcasts';
    }

    public function getLabel(): string
    {
        return 'Podcasts';
    }

    public function getIcon(): string
    {
        return 'Mic'; // Lucide icon
    }

    public function getColor(): string
    {
        return '#6366f1'; // indigo-500
    }

    public function getOverviewStats(): array
    {
        $total = Podcast::count();
        $published = Podcast::where('is_published', true)->count();
        $featured = Podcast::where('is_featured', true)->count();

        return [
            'total' => $total,
            'badges' => [
                ['label' => 'published', 'value' => $published, 'colorClass' => 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'],
                ['label' => 'featured', 'value' => $featured, 'colorClass' => 'bg-amber-500/15 text-amber-400 border-amber-500/20']
            ],
            'href' => '/admin/podcasts', // Assuming route exists
        ];
    }

    public function getQuickActions(): array
    {
        return [
            [
                'title' => 'New Episode',
                'description' => 'Publish podcast episode',
                'route' => 'admin.podcasts.create',
                'icon' => 'mic',
                'color' => 'indigo',
            ]
        ];
    }
}
