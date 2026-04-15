<?php

namespace App\Services\Dashboard;

use Illuminate\Support\Collection;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;

abstract class BaseDashboardSource implements DashboardSourceInterface
{
    /**
     * Define the eloquent model class this source is representing.
     */
    abstract protected function getModelClass(): string;

    /**
     * Base implementation defaults true. Legacy sources will override to false.
     */
    public function isDefaultEnabled(): bool
    {
        return true;
    }

    public function getDistributionValue(): int
    {
        return app($this->getModelClass())->count();
    }

    public function getTimelineData(Carbon $start, Carbon $end): int
    {
        return app($this->getModelClass())
            ->whereBetween('created_at', [$start, $end])
            ->count();
    }

    public function getQuickActions(): array
    {
        return [];
    }

    public function getRecentActivity(int $limit = 5): Collection
    {
        $query = app($this->getModelClass())->latest();
        
        $eagerLoads = $this->getEagerLoads();
        if (!empty($eagerLoads)) {
            $query->with($eagerLoads);
        }

        return $query->take($limit)->get();
    }

    /**
     * Define any relationships that should be eager loaded for recent activity.
     */
    protected function getEagerLoads(): array
    {
        return [];
    }
}
