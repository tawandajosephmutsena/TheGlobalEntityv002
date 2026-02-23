<?php

namespace App\Console\Commands;

use App\Models\MediaAsset;
use App\Services\ImageOptimizationService;
use Illuminate\Console\Command;

class OptimizeMediaCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'media:optimize {--force : Force re-optimization of all images even if they already have conversions}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Optimize existing media assets by generating WebP versions and standard sizes.';

    /**
     * Execute the console command.
     */
    public function handle(ImageOptimizationService $optimizationService)
    {
        $this->info('Starting media optimization...');

        $query = MediaAsset::where('is_image', true)
            ->where('mime_type', '!=', 'image/svg+xml');

        if (!$this->option('force')) {
            $query->whereNull('conversions');
        }

        $assets = $query->get();
        $total = $assets->count();

        if ($total === 0) {
            $this->info('No unoptimized images found.');
            return;
        }

        $this->info("Found {$total} images to optimize.");
        $bar = $this->output->createProgressBar($total);
        
        $bar->start();

        /** @var \App\Models\MediaAsset $asset */
        foreach ($assets as $asset) {
            try {
                $optimizationService->optimizeAsset($asset);
            } catch (\Exception $e) {
                $this->error("\nFailed to optimize asset ID {$asset->id}: {$e->getMessage()}");
            }
            $bar->advance();
        }

        $bar->finish();
        $this->info("\nMedia optimization complete!");
    }
}
