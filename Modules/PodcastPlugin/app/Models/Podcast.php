<?php

namespace Modules\PodcastPlugin\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;
use App\Models\Category;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Podcast extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'description',
        'content',
        'media_url',
        'media_type',
        'thumbnail',
        'duration',
        'file_size',
        'podcast_category_id',
        'category_id',
        'author_id',
        'season_number',
        'episode_number',
        'tags',
        'is_published',
        'is_featured',
        'published_at',
        'play_count',
        'share_count',
        'transcript_url',
        'transcript_link_text',
    ];

    protected $casts = [
        'tags' => 'array',
        'is_published' => 'boolean',
        'is_featured' => 'boolean',
        'published_at' => 'datetime',
        'duration' => 'integer',
        'file_size' => 'integer',
        'play_count' => 'integer',
        'share_count' => 'integer',
    ];

    protected $appends = [
        'formatted_duration',
        'formatted_file_size',
        'media_full_url',
        'thumbnail_url',
    ];

    protected static function booted(): void
    {
        static::creating(function (Podcast $podcast) {
            if (empty($podcast->slug)) {
                $podcast->slug = Str::slug($podcast->title);
            }
            // Ensure unique slug
            $originalSlug = $podcast->slug;
            $counter = 1;
            while (static::where('slug', $podcast->slug)->exists()) { 
                $podcast->slug = $originalSlug . '-' . $counter++;
            }
        });
    }

    // ── Relationships ──

    public function podcastCategory(): BelongsTo
    {
        return $this->belongsTo(PodcastCategory::class, 'podcast_category_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'category_podcast');
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function plays(): HasMany
    {
        return $this->hasMany(PodcastPlay::class);
    }

    // ── Scopes ──

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true)
            ->where(function ($q) {
                $q->whereNull('published_at')
                  ->orWhere('published_at', '<=', now()->toDateTimeString());
            });
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    public function scopeByCategory(Builder $query, int $categoryId): Builder
    {
        return $query->where('podcast_category_id', $categoryId);
    }

    public function scopeSearch(Builder $query, string $term): Builder
    {
        return $query->where(function ($q) use ($term) {
            $q->where('title', 'like', "%{$term}%")
              ->orWhere('description', 'like', "%{$term}%");
        });
    }

    // ── Accessors ──

    public function getFormattedDurationAttribute(): string
    {
        $seconds = $this->attributes['duration'] ?? 0;
        if ($seconds <= 0) return '0:00';

        $hours = floor($seconds / 3600);
        $minutes = floor(($seconds % 3600) / 60);
        $secs = $seconds % 60;

        if ($hours > 0) {
            return sprintf('%d:%02d:%02d', $hours, $minutes, $secs);
        }

        return sprintf('%d:%02d', $minutes, $secs);
    }

    public function getFormattedFileSizeAttribute(): string
    {
        $bytes = $this->attributes['file_size'] ?? 0;
        if ($bytes <= 0) return '0 B';

        $units = ['B', 'KB', 'MB', 'GB'];
        $power = floor(log($bytes, 1024));
        $power = min($power, count($units) - 1);

        return round($bytes / pow(1024, $power), 1) . ' ' . $units[$power];
    }

    public function getMediaFullUrlAttribute(): string
    {
        $mediaUrl = $this->attributes['media_url'] ?? '';
        if (empty($mediaUrl)) return '';

        if (Str::startsWith($mediaUrl, ['http://', 'https://'])) {
            return $mediaUrl;
        }
        return asset('storage/' . $mediaUrl);
    }

    public function getThumbnailUrlAttribute(): ?string
    {
        $thumbnail = $this->attributes['thumbnail'] ?? '';
        if (empty($thumbnail)) return null;

        if (Str::startsWith($thumbnail, ['http://', 'https://'])) {
            return $thumbnail;
        }
        return asset('storage/' . $thumbnail);
    }

    // ── Helpers ──

    public function getShareUrl(string $platform): string
    {
        $url = urlencode(url('/podcasts/' . $this->slug));
        $text = urlencode($this->title);

        return match ($platform) {
            'twitter' => "https://twitter.com/intent/tweet?text={$text}&url={$url}",
            'facebook' => "https://www.facebook.com/sharer/sharer.php?u={$url}",
            'linkedin' => "https://www.linkedin.com/sharing/share-offsite/?url={$url}",
            'whatsapp' => "https://wa.me/?text={$text}%20{$url}",
            default => url('/podcasts/' . $this->slug),
        };
    }

    public function incrementPlayCount(): void
    {
        $this->increment('play_count');
    }

    public function incrementShareCount(): void
    {
        $this->increment('share_count');
    }
}
