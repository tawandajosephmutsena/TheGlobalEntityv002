<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Ensure all defined roles exist
        $roles = [
            ['name' => 'Super Admin', 'slug' => 'super-admin', 'description' => 'Unrestricted access to all system features.'],
            ['name' => 'Administrator', 'slug' => 'admin', 'description' => 'Global administrative access.'],
            ['name' => 'Content Editor', 'slug' => 'editor', 'description' => 'Can manage content across the site.'],
            ['name' => 'Viewer', 'slug' => 'viewer', 'description' => 'Can view content but not change it.'],
            ['name' => 'Subscriber', 'slug' => 'subscriber', 'description' => 'Basic user with subscription access.'],
            ['name' => 'Reviewer', 'slug' => 'reviewer', 'description' => 'Can review content and provide feedback.'],
            ['name' => 'Festival Organizer', 'slug' => 'festival_organizer', 'description' => 'Can manage their own festivals and events.'],
        ];

        foreach ($roles as $roleData) {
            Role::firstOrCreate(['slug' => $roleData['slug']], $roleData);
        }

        // 2. Sync existing users from the 'role' enum column to 'role_user' pivot table
        $users = User::all();
        foreach ($users as $user) {
            $roleSlug = $user->role; // This is the old enum column
            
            if ($roleSlug) {
                $role = Role::where('slug', $roleSlug)->first();
                if ($role) {
                    // Check if already assigned
                    if (!DB::table('role_user')->where([
                        'user_id' => $user->id,
                        'role_id' => $role->id,
                    ])->exists()) {
                        DB::table('role_user')->insert([
                            'user_id' => $user->id,
                            'role_id' => $role->id,
                        ]);
                    }
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // We don't necessarily want to delete the roles or links on rollback 
        // because it might be destructive if the app is already using RBAC.
    }
};
