<?php

namespace App\Services\Dashboard\Sources;

use App\Models\PortfolioItem;
use App\Services\Dashboard\BaseDashboardSource;

class PortfolioItemsSource extends BaseDashboardSource
{
    protected function getModelClass(): string
    {
        return PortfolioItem::class;
    }

    public function getKey(): string
    {
        return 'portfolio_items';
    }

    public function getLabel(): string
    {
        return 'Portfolio';
    }

    public function getIcon(): string
    {
        return 'FolderOpen';
    }

    public function getColor(): string
    {
        return '#C25E2E'; 
    }

    public function isDefaultEnabled(): bool
    {
        return false;
    }

    public function getOverviewStats(): array
    {
        $total = PortfolioItem::count();
        $published = PortfolioItem::where('is_published', true)->count();
        $featured = PortfolioItem::where('is_featured', true)->count();

        return [
            'total' => $total,
            'badges' => [
                ['label' => 'published', 'value' => $published, 'colorClass' => 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'],
                ['label' => 'featured', 'value' => $featured, 'colorClass' => 'bg-amber-500/15 text-amber-400 border-amber-500/20']
            ],
            'href' => '/admin/portfolio',
        ];
    }

    public function getQuickActions(): array
    {
        return [
            [
                'title' => 'New Portfolio',
                'description' => 'Add a showcase project',
                'route' => 'admin.portfolio.create',
                'icon' => 'folder-open',
                'color' => 'orange',
            ]
        ];
    }
}
