<?php

namespace App\Services\Dashboard\Sources;

use App\Models\Service;
use App\Services\Dashboard\BaseDashboardSource;

class ServicesSource extends BaseDashboardSource
{
    protected function getModelClass(): string
    {
        return Service::class;
    }

    public function getKey(): string
    {
        return 'services';
    }

    public function getLabel(): string
    {
        return 'Services';
    }

    public function getIcon(): string
    {
        return 'Briefcase';
    }

    public function getColor(): string
    {
        return '#3b82f6'; // blue-500
    }

    public function isDefaultEnabled(): bool
    {
        return false;
    }

    public function getOverviewStats(): array
    {
        $total = Service::count();
        $published = Service::where('is_published', true)->count();
        $featured = Service::where('is_featured', true)->count();

        return [
            'total' => $total,
            'badges' => [
                ['label' => 'published', 'value' => $published, 'colorClass' => 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'],
                ['label' => 'featured', 'value' => $featured, 'colorClass' => 'bg-amber-500/15 text-amber-400 border-amber-500/20']
            ],
            'href' => '/admin/services',
        ];
    }

    public function getQuickActions(): array
    {
        return [
            [
                'title' => 'Add Service',
                'description' => 'New service offering',
                'route' => 'admin.services.create',
                'icon' => 'briefcase',
                'color' => 'blue',
            ]
        ];
    }
}
