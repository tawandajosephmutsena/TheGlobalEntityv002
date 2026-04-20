<?php

namespace Modules\PodcastPlugin\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class PodcastCategory extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'color',
        'icon',
        'sort_order',
        'is_active',
        'artwork',
        'author',
        'owner_name',
        'owner_email',
        'itunes_category',
        'itunes_explicit',
        'itunes_type',
        'language',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
        'itunes_explicit' => 'boolean',
    ];

    protected static function booted(): void
    {
        static::creating(function (PodcastCategory $category) {
            if (empty($category->slug)) {
                $category->slug = Str::slug($category->name);
            }
        });
    }

    public function podcasts(): HasMany
    {
        return $this->hasMany(Podcast::class, 'podcast_category_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
