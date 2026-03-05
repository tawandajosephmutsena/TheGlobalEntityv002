<?php

namespace App\Models;

use App\Traits\HasVersions;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Review extends Model
{
    use HasFactory, HasVersions;

    protected $fillable = [
        'user_id',
        'reviewable_id',
        'reviewable_type',
        'vibe_rating',
        'safety_rating',
        'sustainability_rating',
        'body',
        'status',
    ];

    protected $casts = [
        'vibe_rating' => 'integer',
        'safety_rating' => 'integer',
        'sustainability_rating' => 'integer',
    ];

    /**
     * Get the owning reviewable model.
     */
    public function reviewable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Get the user that wrote the review.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
