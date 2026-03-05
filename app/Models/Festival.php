<?php

namespace App\Models;

use App\Traits\HasVersions;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Festival extends Model
{
    use HasFactory, HasVersions;

    protected $fillable = [
        'name',
        'slug',
        'location',
        'start_date',
        'end_date',
        'social_tags',
        'is_published',
        'author_id',
    ];

    protected $casts = [
        'location' => 'array',
        'social_tags' => 'array',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'is_published' => 'boolean',
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
}
