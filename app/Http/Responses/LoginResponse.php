<?php

namespace App\Http\Responses;

use Illuminate\Support\Facades\Auth;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function toResponse($request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // High priority: Admin and Editor landing pages
        if ($user->hasRole('super-admin') || $user->hasRole('admin')) {
            return redirect()->intended(route('admin.dashboard'));
        }

        if ($user->hasRole('editor')) {
            return redirect()->intended(route('cms.dashboard'));
        }

        // Specialized roles
        if ($user->hasRole('festival_organizer')) {
            return redirect()->intended(route('organizer.dashboard'));
        }

        if ($user->hasRole('reviewer')) {
            return redirect()->intended(route('reviewer.dashboard'));
        }

        // Default landing for viewers, subscribers, and others
        return redirect()->intended(config('fortify.home'));
    }
}
