<?php

use Illuminate\Support\Facades\Route;
use Modules\PodcastPlugin\Http\Controllers\PodcastPublicController;

/*
|--------------------------------------------------------------------------
| Podcast API Routes
|--------------------------------------------------------------------------
*/
Route::prefix('podcasts')->name('podcasts.')->group(function () {
    Route::post('{id}/play', [PodcastPublicController::class, 'trackPlay'])->name('track-play');
    Route::get('search', [PodcastPublicController::class, 'search'])->name('search');
});
