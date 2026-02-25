<?php

use App\Models\User;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Seed RBAC roles
    $this->seed(\Database\Seeders\RBACSeeder::class);
});

test('newly registered user in local environment is auto-verified and has RBAC role', function () {
    // Ensure we are in local environment
    config(['app.env' => 'local']);

    $response = $this->post('/register', [
        'name' => 'New User',
        'email' => 'newuser@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertRedirect('/dashboard');

    $user = User::where('email', 'newuser@example.com')->first();

    // 1. Check auto-verification
    expect($user->email_verified_at)->not->toBeNull();

    // 2. Check main table role
    expect($user->role)->toBe('viewer');

    // 3. Check RBAC link
    expect($user->roles()->where('slug', 'viewer')->exists())->toBeTrue();
});

test('newly registered user with specific role is synced to RBAC', function () {
    // This simulates a registration where role might be passed (if allowed by UI/API)
    config(['app.env' => 'local']);
    
    $response = $this->post('/register', [
        'name' => 'Editor User',
        'email' => 'editor_new@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
        'role' => 'editor'
    ]);

    $user = User::where('email', 'editor_new@example.com')->first();
    expect($user->role)->toBe('editor');
    expect($user->roles()->where('slug', 'editor')->exists())->toBeTrue();
});
