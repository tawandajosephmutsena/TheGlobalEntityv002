<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Reaction extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'reactable_id',
        'reactable_type',
    ];

    /**
     * Valid reaction types.
     */
    public const TYPES = ['like', 'love', 'celebrate', 'insightful'];

    /**
     * The user who reacted.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The reactable model (Insight, Comment, etc.).
     */
    public function reactable(): MorphTo
    {
        return $this->morphTo();
    }
}
