<?php

namespace App\Models;

use App\Traits\HasVersions;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Festival extends Model
{
    use HasFactory, HasVersions;

    protected $fillable = [
        'name',
        'description',
        'slug',
        'type',
        'location',
        'start_date',
        'end_date',
        'social_tags',
        'is_published',
        'is_featured',
        'author_id',
        'category_id',
        'image',
        'gallery',
    ];

    /**
     * Get the category that the festival belongs to.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    protected $casts = [
        'location' => 'array',
        'social_tags' => 'array',
        'gallery' => 'array',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'is_published' => 'boolean',
        'is_featured' => 'boolean',
    ];

    /**
     * Get the author that owns the festival.
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * Get all of the festival's reviews.
     */
    public function reviews(): MorphMany
    {
        return $this->morphMany(Review::class, 'reviewable');
    }

    /**
     * Get the activities for the festival.
     */
    public function activities(): HasMany
    {
        return $this->hasMany(Activity::class);
    }
}
