<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;
    
    public const ROLE_ADMIN = 'admin';
    public const ROLE_EDITOR = 'editor';
    public const ROLE_VIEWER = 'viewer';
    public const ROLE_SUBSCRIBER = 'subscriber';
    public const ROLE_REVIEWER = 'reviewer';
    public const ROLE_FESTIVAL_ORGANIZER = 'festival_organizer';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role', // @deprecated: transition to RBAC roles relation
        'is_active',
        'avatar',
        'about',
        'social_links',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'is_active' => 'boolean',
            'social_links' => 'array',
        ];
    }

    public function insights(): HasMany
    {
        return $this->hasMany(Insight::class, 'author_id');
    }

    /**
     * Comments by this user.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    /**
     * Reactions by this user.
     */
    public function reactions(): HasMany
    {
        return $this->hasMany(Reaction::class);
    }

    /**
     * The roles that belong to the user.
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class);
    }

    /**
     * The permissions that belong to the user through roles.
     */
    public function permissions()
    {
        return $this->roles->flatMap(function ($role) {
            return $role->permissions;
        })->unique('slug');
    }


    /**
     * Check if user has admin role
     */
    public function isAdmin(): bool
    {
        return $this->hasRole('admin') || $this->hasRole('super-admin');
    }

    /**
     * Check if user has editor role or higher
     */
    public function isEditor(): bool
    {
        if ($this->isAdmin()) return true;
        return $this->hasRole('editor');
    }

    /**
     * Check if user has viewer role or higher
     */
    public function isViewer(): bool
    {
        if ($this->isEditor()) return true;
        return $this->hasRole('viewer') || $this->hasRole('subscriber');
    }


    /**
     * Check if user has specific role
     */
    public function hasRole(string $role): bool
    {
        // Check for role cached in memory for performance if needed, 
        // but for now simple collection check
        return $this->roles->contains('slug', $role);
    }

    /**
     * Check if user has any of the given roles
     */
    public function hasAnyRole(array $roles): bool
    {
        return $this->roles->whereIn('slug', $roles)->isNotEmpty();
    }

    /**
     * Check if user has a specific permission
     */
    public function hasPermission(string $permission): bool
    {
        if ($this->hasRole('super-admin')) {
            return true;
        }

        return $this->roles->some(function ($role) use ($permission) {
            return $role->hasPermission($permission);
        });
    }

}
