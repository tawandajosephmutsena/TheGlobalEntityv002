<?php

namespace App\Services\Dashboard;

use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;

class DashboardRegistry
{
    /**
     * @var DashboardSourceInterface[]
     */
    protected array $sources = [];

    /**
     * Register a new dashboard source.
     */
    public function register(DashboardSourceInterface $source): void
    {
        $this->sources[$source->getKey()] = $source;
    }

    /**
     * Get all registered sources.
     */
    public function getSources(): array
    {
        return $this->sources;
    }

    /**
     * Aggregate overview statistics for all sources.
     * Caches the result per source.
     */
    public function aggregateStats(): array
    {
        $stats = [];
        foreach ($this->sources as $source) {
            $key = 'dashboard_stats_' . $source->getKey();
            
            $stats[$source->getKey()] = Cache::remember($key, 300, function () use ($source) {
                return array_merge([
                    'key' => $source->getKey(),
                    'label' => $source->getLabel(),
                    'icon' => $source->getIcon(),
                    'color' => $source->getColor(),
                    'isDefaultEnabled' => $source->isDefaultEnabled(),
                ], $source->getOverviewStats());
            });
        }
        return array_values($stats);
    }

    /**
     * Aggregate recent activity across all sources.
     * Sorts descending by created_at.
     */
    public function aggregateRecentActivity(int $limit = 5): array
    {
        $activities = [];
        foreach ($this->sources as $source) {
            $key = 'dashboard_recent_' . $source->getKey() . '_' . $limit;
            $items = Cache::remember($key, 300, function () use ($source, $limit) {
                return $source->getRecentActivity($limit)->toArray();
            });
            
            $activities[$source->getKey()] = [
                'label' => $source->getLabel(),
                'color' => $source->getColor(),
                'items' => $items,
                'href' => $source->getOverviewStats()['href'] ?? '#',
                'isDefaultEnabled' => $source->isDefaultEnabled(),
            ];
        }
        
        return $activities;
    }

    /**
     * Aggregate content distribution values for the PieChart.
     */
    public function aggregateDistribution(): array
    {
        $distribution = [];
        foreach ($this->sources as $source) {
            $key = 'dashboard_dist_' . $source->getKey();
            $val = Cache::remember($key, 300, function () use ($source) {
                return $source->getDistributionValue();
            });

            if ($val > 0) {
                $distribution[] = [
                    'name' => $source->getLabel(),
                    'value' => $val,
                    'color' => $source->getColor(),
                    'key' => $source->getKey(),
                    'isDefaultEnabled' => $source->isDefaultEnabled(),
                ];
            }
        }
        return $distribution;
    }

    /**
     * Aggregate timeline data for AreaChart (last $days days).
     */
    public function aggregateTimeline(int $days = 7): array
    {
        $timelineKeys = [];
        // Determine structure
        foreach ($this->sources as $source) {
            if ($source->getDistributionValue() > 0 || $source->isDefaultEnabled()) {
               $timelineKeys[] = $source;
            }
        }

        $timeline = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $dayStart = $date->copy()->startOfDay();
            $dayEnd = $date->copy()->endOfDay();
            
            $dayData = ['date' => $date->format('M d')];
            
            foreach ($timelineKeys as $source) {
                $key = "dashboard_timeline_{$source->getKey()}_{$date->format('Y_m_d')}";
                // Over historic days, caching forever could be better, but 300s is safe and simple
                // We use 3600 (1 hour) for historic days, and 300 (5 mins) for today
                $cacheTime = ($i === 0) ? 300 : 3600;
                
                $dayData[$source->getKey()] = Cache::remember($key, $cacheTime, function () use ($source, $dayStart, $dayEnd) {
                    return $source->getTimelineData($dayStart, $dayEnd);
                });
            }
            $timeline[] = $dayData;
        }

        return [
            'data' => $timeline,
            'keys' => array_map(fn($src) => [
                'key' => $src->getKey(),
                'label' => $src->getLabel(),
                'color' => $src->getColor(),
                'isDefaultEnabled' => $src->isDefaultEnabled(),
            ], $timelineKeys)
        ];
    }

    /**
     * Get aggregate quick actions
     */
    public function aggregateQuickActions(): array
    {
        $actions = [];
        foreach ($this->sources as $source) {
            if ($source->isDefaultEnabled() || $source->getDistributionValue() > 0) {
                $actions = array_merge($actions, $source->getQuickActions());
            }
        }
        return $actions;
    }

    /**
     * Return next cache update epoch timestamp based on 5 minute grid, or precise estimate
     */
    public function getNextUpdateTimestamp(): int
    {
        // For simplicity, pretend refresh happens exactly every 5 minutes on the clock (e.g. 10:00, 10:05)
        $now = now();
        $minutes = $now->minute;
        $nextTick = ((int)($minutes / 5) + 1) * 5;
        $nextUpdate = $now->copy()->minute($nextTick)->second(0);
        return $nextUpdate->getTimestamp() * 1000;
    }
}
