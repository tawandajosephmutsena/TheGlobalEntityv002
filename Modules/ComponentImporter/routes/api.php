<?php

use Illuminate\Support\Facades\Route;
use Modules\ComponentImporter\Http\Controllers\ComponentImporterController;

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::apiResource('componentimporters', ComponentImporterController::class)->names('componentimporter');
});
