<?php

namespace App\Services\Dashboard\Sources;

use App\Models\Festival;
use App\Services\Dashboard\BaseDashboardSource;

class FestivalSource extends BaseDashboardSource
{
    protected function getModelClass(): string
    {
        return Festival::class;
    }

    public function getKey(): string
    {
        return 'festivals';
    }

    public function getLabel(): string
    {
        return 'Festivals';
    }

    public function getIcon(): string
    {
        return 'CalendarDays'; // Lucide icon
    }

    public function getColor(): string
    {
        return '#f97316'; // orange-500
    }

    public function getOverviewStats(): array
    {
        $total = Festival::count();
        $upcoming = Festival::where('start_date', '>', now())->count();
        $featured = Festival::where('is_featured', true)->count(); // assuming this exists, if not just 0 or omit

        return [
            'total' => $total,
            'badges' => [
                ['label' => 'upcoming', 'value' => $upcoming, 'colorClass' => 'bg-orange-500/15 text-orange-400 border-orange-500/20'],
                ['label' => 'featured', 'value' => $featured, 'colorClass' => 'bg-amber-500/15 text-amber-400 border-amber-500/20']
            ],
            'href' => '/admin/festivals', // Assuming admin route config
        ];
    }

    public function getQuickActions(): array
    {
        return [
            [
                'title' => 'New Festival',
                'description' => 'Add an upcoming event',
                'route' => 'admin.festivals.create',
                'icon' => 'calendar',
                'color' => 'orange',
            ]
        ];
    }
}
