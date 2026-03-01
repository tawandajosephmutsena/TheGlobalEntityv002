<?php

namespace Modules\PodcastPlugin\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PodcastPlay extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'podcast_id',
        'ip_address',
        'user_agent',
        'played_at',
        'duration_listened',
    ];

    protected $casts = [
        'played_at' => 'datetime',
        'duration_listened' => 'integer',
    ];

    public function podcast(): BelongsTo
    {
        return $this->belongsTo(Podcast::class);
    }
}
