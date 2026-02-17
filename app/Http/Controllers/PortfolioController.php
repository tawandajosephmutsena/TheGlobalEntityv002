<?php

namespace App\Http\Controllers;

use App\Models\PortfolioItem;
use App\Models\Page;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PortfolioController extends Controller
{
    /**
     * Display a listing of the portfolio items.
     */
    public function index(Request $request): Response
    {
        $page = $request->get('page', 1);
        $version = \Illuminate\Support\Facades\Cache::get('portfolio.cache_version', 1);
        $cacheKey = 'portfolio.index.' . $version . '.' . $page;

        $portfolioItems = \Illuminate\Support\Facades\Cache::flexible($cacheKey, [60 * 60, 60 * 60 * 2], function () {
            return PortfolioItem::with('category')
                ->published()
                ->ordered()
                ->paginate(12);
        });

        $categories = \App\Models\Category::where('type', 'portfolio')->get();


        $dynamicPage = Page::published()->where('slug', 'portfolio')->first();

        return Inertia::render('Portfolio', [
            'portfolioItems' => $portfolioItems,
            'categories' => $categories,
            'page' => $dynamicPage,
        ]);

    }

    /**
     * Display the specified portfolio item.
     */
    public function show(string $slug): Response
    {
        $portfolioItem = PortfolioItem::with('category')
            ->published()
            ->where('slug', $slug)
            ->firstOrFail();


        return Inertia::render('Portfolio/Show', [
            'portfolioItem' => $portfolioItem,
        ]);
    }
}
