<?php

use Illuminate\Support\Facades\Route;
use Modules\PodcastPlugin\Http\Controllers\PodcastAdminController;
use Modules\PodcastPlugin\Http\Controllers\PodcastCategoryAdminController;
use Modules\PodcastPlugin\Http\Controllers\PodcastPublicController;
use Modules\PodcastPlugin\Http\Controllers\PodcastFeedController;

/*
|--------------------------------------------------------------------------
| Admin Routes (auth + admin middleware)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified', 'admin', 'cache.headers:no-cache'])->prefix('admin')->name('admin.')->group(function () {
    // Podcast CRUD
    Route::resource('podcasts', PodcastAdminController::class)->except(['show']);
    Route::post('podcasts/{id}/toggle-published', [PodcastAdminController::class, 'togglePublished'])->name('podcasts.toggle-published');
    Route::post('podcasts/{id}/toggle-featured', [PodcastAdminController::class, 'toggleFeatured'])->name('podcasts.toggle-featured');
    Route::post('podcasts/bulk-action', [PodcastAdminController::class, 'bulkAction'])->name('podcasts.bulk-action');

    // Podcast Categories CRUD
    Route::resource('podcast-categories', PodcastCategoryAdminController::class)->except(['show', 'create', 'edit']);
});

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::middleware([App\Http\Middleware\CacheHeadersMiddleware::class . ':public'])->group(function () {
    Route::get('/podcasts', [PodcastPublicController::class, 'index'])->name('podcasts');
    Route::get('/podcasts/{slug}', [PodcastPublicController::class, 'show'])->name('podcasts.show');
    Route::get('/feed/podcast/{category:slug}', [PodcastFeedController::class, 'show'])->name('podcasts.feed');
});
