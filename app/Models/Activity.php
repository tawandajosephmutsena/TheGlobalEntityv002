<?php

namespace App\Models;

use App\Traits\HasVersions;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Activity extends Model
{
    use HasFactory, HasVersions;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'festival_id',
        'category',
        'start_time',
        'end_time',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    /**
     * Get the festival that owns the activity.
     */
    public function festival(): BelongsTo
    {
        return $this->belongsTo(Festival::class);
    }
}
