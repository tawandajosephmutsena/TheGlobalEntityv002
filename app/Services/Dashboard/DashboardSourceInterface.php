<?php

namespace App\Services\Dashboard;

use Illuminate\Support\Collection;
use Carbon\Carbon;

interface DashboardSourceInterface
{
    /**
     * Unique identifier for the source (e.g. 'festivals', 'podcasts')
     */
    public function getKey(): string;

    /**
     * Human-readable label for the source (e.g. 'Festivals')
     */
    public function getLabel(): string;

    /**
     * Lucide React icon name (e.g. 'CalendarDays', 'Mic')
     */
    public function getIcon(): string;

    /**
     * Optional Tailwind color or hex for theming the stat card
     */
    public function getColor(): string;

    /**
     * Returns an array with an essential 'total' key and an array of 'badges'.
     * Example:
     * return [
     *     'total' => 150,
     *     'badges' => [
     *         ['label' => 'published', 'value' => 120, 'colorClass' => 'text-emerald-400...'],
     *         ['label' => 'featured', 'value' => 5]
     *     ],
     *     'href' => '/admin/festivals'
     * ];
     */
    public function getOverviewStats(): array;

    /**
     * Get recent activity records for the dashboard list
     */
    public function getRecentActivity(int $limit = 5): Collection;

    /**
     * Get the count used for the content distribution PieChart
     */
    public function getDistributionValue(): int;

    /**
     * Get the number of items created between the start and end dates for the Timeline AreaChart
     */
    public function getTimelineData(Carbon $start, Carbon $end): int;

    /**
     * Return quick actions associated with this source (e.g. "Create Event")
     * Example:
     * return [
     *    ['title' => 'New Festival', 'description' => 'Add an event', 'route' => 'admin.festivals.create', 'icon' => 'calendar', 'color' => 'blue']
     * ];
     */
    public function getQuickActions(): array;

    /**
     * Should this widget be enabled by default? Used to toggle legacy vs core models
     */
    public function isDefaultEnabled(): bool;
}
