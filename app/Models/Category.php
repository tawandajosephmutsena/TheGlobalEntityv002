<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'type', // insight, service, portfolio, festival
    ];

    public function festivals(): HasMany
    {
        return $this->hasMany(Festival::class);
    }

    public function insights(): HasMany
    {
        return $this->hasMany(Insight::class);
    }

    public function services(): HasMany
    {
        return $this->hasMany(Service::class);
    }

    public function portfolioItems(): HasMany
    {
        return $this->hasMany(PortfolioItem::class);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function getRouteKeyName()
    {
        return 'slug';
    }
}
