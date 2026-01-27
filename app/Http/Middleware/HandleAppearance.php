<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use Symfony\Component\HttpFoundation\Response;

class HandleAppearance
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Try to get the appearance from cookie first
        $appearance = $request->cookie('appearance');

        // If no cookie, use the site-wide default from settings (or 'system')
        if (!$appearance) {
            $appearance = \App\Models\Setting::get('default_appearance', 'system');
        }

        View::share('appearance', $appearance);
        \Inertia\Inertia::share('appearance', $appearance);

        return $next($request);
    }
}
