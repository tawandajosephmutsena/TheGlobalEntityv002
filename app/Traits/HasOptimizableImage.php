<?php

namespace App\Traits;

use App\Models\MediaAsset;
use Illuminate\Support\Facades\Cache;

trait HasOptimizableImage
{
    /**
     * Get optimized image data for a given field
     * 
     * @param string $field The field containing the image path
     * @return array|null
     */
    public function getOptimizedImage(string $field): ?array
    {
        $path = $this->getAttribute($field);

        if (!$path) {
            return null;
        }

        // Cache the lookup for performance
        $cacheKey = 'optimized_image_' . md5($path);

        return Cache::remember($cacheKey, now()->addDay(), function () use ($path) {
            $asset = MediaAsset::where('path', $path)
                ->orWhere('path', str_replace('storage/', '', $path))
                ->first();

            if (!$asset || !$asset->conversions) {
                return null;
            }

            return $asset->conversions;
        });
    }

    /**
     * Append optimized image data to the model's array/JSON representation
     */
    public function appendOptimizedImages(array $fields): self
    {
        $optimized = [];
        foreach ($fields as $field) {
            $optimized[$field] = $this->getOptimizedImage($field);
        }

        $this->setAttribute('image_conversions', $optimized);

        return $this;
    }
}
