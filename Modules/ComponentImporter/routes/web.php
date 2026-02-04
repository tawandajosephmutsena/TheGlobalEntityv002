<?php

use Illuminate\Support\Facades\Route;
use Modules\ComponentImporter\Http\Controllers\ComponentImporterController;

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin/plugins')->group(function () {
    Route::get('component-importer', [ComponentImporterController::class, 'index'])->name('admin.plugins.component-importer');
});
