<?php

namespace App\Services\Dashboard\Sources;

use App\Models\Review;
use App\Services\Dashboard\BaseDashboardSource;

class ReviewSource extends BaseDashboardSource
{
    protected function getModelClass(): string
    {
        return Review::class;
    }

    public function getKey(): string
    {
        return 'reviews';
    }

    public function getLabel(): string
    {
        return 'Reviews';
    }

    public function getIcon(): string
    {
        return 'Star';
    }

    public function getColor(): string
    {
        return '#facc15'; // yellow-400
    }

    public function getOverviewStats(): array
    {
        $total = Review::count();
        $pending = Review::where('status', 'pending')->count();
        $published = Review::where('status', 'published')->count();

        return [
            'total' => $total,
            'badges' => [
                ['label' => 'pending', 'value' => $pending, 'colorClass' => 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20'],
                ['label' => 'published', 'value' => $published, 'colorClass' => 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20']
            ],
            'href' => '/admin/reviews', 
        ];
    }
}
