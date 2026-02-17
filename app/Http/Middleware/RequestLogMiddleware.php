<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class RequestLogMiddleware
{
    /**
     * Handle an incoming request — just record the start time.
     */
    public function handle(Request $request, Closure $next): SymfonyResponse
    {
        $request->attributes->set('_request_started_at', microtime(true));

        return $next($request);
    }

    /**
     * Run after the response has been sent to the browser (terminable).
     * No latency impact on the user.
     */
    public function terminate(Request $request, SymfonyResponse $response): void
    {
        // Only log when explicitly enabled or in production
        if (! $this->shouldLog()) {
            return;
        }

        $startTime = $request->attributes->get('_request_started_at');
        $duration = $startTime ? round((microtime(true) - $startTime) * 1000, 2) : null;

        Log::info('request.completed', [
            'method'      => $request->method(),
            'uri'         => $request->getRequestUri(),
            'status'      => $response->getStatusCode(),
            'duration_ms' => $duration,
            'memory_mb'   => round(memory_get_peak_usage(true) / 1024 / 1024, 2),
            'ip'          => $request->ip(),
            'user_agent'  => $request->userAgent(),
        ]);
    }

    private function shouldLog(): bool
    {
        // Always log if LOG_REQUESTS is explicitly true
        if (config('app.log_requests', false)) {
            return true;
        }

        // Default: only log in production
        return app()->environment('production');
    }
}
