<?php

namespace App\Services\Dashboard\Sources;

use App\Models\Insight;
use App\Services\Dashboard\BaseDashboardSource;

class InsightSource extends BaseDashboardSource
{
    protected function getModelClass(): string
    {
        return Insight::class;
    }

    public function getKey(): string
    {
        return 'insights';
    }

    public function getLabel(): string
    {
        return 'Insights';
    }

    public function getIcon(): string
    {
        return 'FileText';
    }

    public function getColor(): string
    {
        return '#a855f7'; // purple-500
    }

    public function getOverviewStats(): array
    {
        $total = Insight::count();
        $published = Insight::where('is_published', true)->count();
        $featured = Insight::where('is_featured', true)->count();

        return [
            'total' => $total,
            'badges' => [
                ['label' => 'published', 'value' => $published, 'colorClass' => 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'],
                ['label' => 'featured', 'value' => $featured, 'colorClass' => 'bg-amber-500/15 text-amber-400 border-amber-500/20']
            ],
            'href' => '/admin/insights',
        ];
    }

    public function getQuickActions(): array
    {
        return [
            [
                'title' => 'Write Insight',
                'description' => 'Create a blog post',
                'route' => 'admin.insights.create',
                'icon' => 'file-text',
                'color' => 'purple',
            ]
        ];
    }
}
