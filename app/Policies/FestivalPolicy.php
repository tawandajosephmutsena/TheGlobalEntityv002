<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class FestivalPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermission('festivals.read');
    }

    public function view(User $user, $model = null): bool
    {
        return $user->hasPermission('festivals.read');
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('festivals.create');
    }

    public function update(User $user, $model): bool
    {
        // An organizer can update their own festival
        if ($user->hasRole('festival_organizer') && $model->author_id === $user->id) {
            return true;
        }

        return $user->hasPermission('festivals.update');
    }

    public function delete(User $user, $model): bool
    {
        // An organizer can delete their own festival
        if ($user->hasRole('festival_organizer') && $model->author_id === $user->id) {
            return true;
        }

        return $user->hasPermission('festivals.delete');
    }

    public function publish(User $user): bool
    {
        return $user->hasPermission('festivals.publish');
    }

    public function unpublish(User $user): bool
    {
        return $user->hasPermission('festivals.unpublish');
    }

    public function setFeatured(User $user): bool
    {
        return $user->hasPermission('festivals.set_featured');
    }
}
