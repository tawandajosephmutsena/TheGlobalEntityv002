<?php

namespace App\Jobs;

use App\Models\MediaAsset;
use App\Services\ImageOptimizationService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class OptimizeImageJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of seconds the job can run before timing out.
     */
    public $timeout = 120;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public MediaAsset $asset
    ) {}

    /**
     * Execute the job.
     */
    public function handle(ImageOptimizationService $optimizer): void
    {
        try {
            Log::info("Starting background optimization for asset ID: {$this->asset->id}");
            $optimizer->optimizeAsset($this->asset);
            Log::info("Completed background optimization for asset ID: {$this->asset->id}");
        } catch (\Exception $e) {
            Log::error("Queue job failed for image optimization", [
                'asset_id' => $this->asset->id,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }
}
