<?php

namespace App\Http\Controllers\Organizer;

use App\Http\Controllers\Controller;
use App\Models\Festival;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the festival organizer dashboard.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        
        // Fetch festivals created by this organizer
        $festivals = Festival::where('author_id', $user->id)
            ->with(['category'])
            ->latest()
            ->paginate(5);

        // Calculate some basic stats
        $stats = [
            'total_festivals' => Festival::where('author_id', $user->id)->count(),
            'published_festivals' => Festival::where('author_id', $user->id)->where('is_published', true)->count(),
            'recent_reviews' => \App\Models\Review::whereIn('festival_id', function($query) use ($user) {
                    $query->select('id')->from('festivals')->where('author_id', $user->id);
                })->count(),
        ];

        return Inertia::render('organizer/Dashboard', [
            'festivals' => $festivals,
            'stats' => $stats,
        ]);
    }
}
