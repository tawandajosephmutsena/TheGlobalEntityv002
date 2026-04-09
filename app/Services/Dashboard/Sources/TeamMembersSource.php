<?php

namespace App\Services\Dashboard\Sources;

use App\Models\TeamMember;
use App\Services\Dashboard\BaseDashboardSource;

class TeamMembersSource extends BaseDashboardSource
{
    protected function getModelClass(): string
    {
        return TeamMember::class;
    }

    public function getKey(): string
    {
        return 'team_members';
    }

    public function getLabel(): string
    {
        return 'Team Members';
    }

    public function getIcon(): string
    {
        return 'UserCheck';
    }

    public function getColor(): string
    {
        return '#06b6d4'; // cyan-500
    }

    public function isDefaultEnabled(): bool
    {
        return false;
    }

    public function getOverviewStats(): array
    {
        $total = TeamMember::count();
        $active = TeamMember::where('is_active', true)->count();
        $featured = TeamMember::where('is_featured', true)->count();

        return [
            'total' => $total,
            'badges' => [
                ['label' => 'active', 'value' => $active, 'colorClass' => 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'],
                ['label' => 'featured', 'value' => $featured, 'colorClass' => 'bg-amber-500/15 text-amber-400 border-amber-500/20']
            ],
            'href' => '/admin/team',
        ];
    }
}
