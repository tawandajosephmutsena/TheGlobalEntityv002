<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $resources = [
            'insights',
            'festivals',
            'services',
            'portfolio_items',
            'pages',
            'users',
            'categories',
            'media',
            'reviews',
            'settings'
        ];

        $actions = [
            'create',
            'read',
            'update',
            'delete',
            'publish',
            'unpublish',
            'set_featured'
        ];

        // Ensure all permissions exist
        $allPermissions = [];
        foreach ($resources as $resource) {
            foreach ($actions as $action) {
                // Some combinations might not make sense (e.g. set_featured on users)
                // but for simplicity and safety of a generic UI, we define the full matrix
                $slug = $resource . '.' . $action;
                $permission = Permission::firstOrCreate([
                    'slug' => $slug
                ], [
                    'name' => ucfirst($action) . ' ' . ucfirst(str_replace('_', ' ', $resource)),
                    'description' => "Allow user to $action $resource"
                ]);
                $allPermissions[$slug] = $permission->id;
            }
        }

        // --- Role Capability Mapping ---

        // 1. Super Admin (Implicitly has all bypass in code, but good to attach)
        $superAdmin = Role::where('slug', 'super-admin')->first();
        if ($superAdmin) {
            $superAdmin->permissions()->sync(array_values($allPermissions));
        }

        // 2. Admin (All except maybe some super-admin only root functions, but give all for now)
        $admin = Role::where('slug', 'admin')->first();
        if ($admin) {
            $admin->permissions()->sync(array_values($allPermissions));
        }

        // 3. Editor (Content management, no user/settings management)
        $editor = Role::where('slug', 'editor')->first();
        if ($editor) {
            $editorPerms = [];
            foreach ($allPermissions as $slug => $id) {
                if (!str_starts_with($slug, 'users.') && !str_starts_with($slug, 'settings.')) {
                    $editorPerms[] = $id;
                }
            }
            $editor->permissions()->sync($editorPerms);
        }

        // 4. Festival Organizer
        $organizer = Role::where('slug', 'festival_organizer')->first();
        if ($organizer) {
            $organizerPerms = [
                $allPermissions['festivals.create'],
                $allPermissions['festivals.read'],
                $allPermissions['festivals.update'],
                $allPermissions['festivals.delete'],
                // Organizers generally shouldn't publish directly, they submit for review
                // But they can read categories and media
                $allPermissions['categories.read'],
                $allPermissions['media.read'],
                $allPermissions['media.create'],
            ];
            $organizer->permissions()->sync($organizerPerms);
        }

        // 5. Reviewer
        $reviewer = Role::where('slug', 'reviewer')->first();
        if ($reviewer) {
            $reviewerPerms = [
                $allPermissions['reviews.create'],
                $allPermissions['reviews.read'],
                $allPermissions['reviews.update'],
                $allPermissions['reviews.delete'],
                // Read access for what they are reviewing
                $allPermissions['festivals.read'],
                $allPermissions['insights.read'],
            ];
            $reviewer->permissions()->sync($reviewerPerms);
        }

        // 6. Viewer / Subscriber
        $viewer = Role::where('slug', 'viewer')->first();
        $subscriber = Role::where('slug', 'subscriber')->first();
        
        $basicReadPerms = [];
        foreach ($resources as $resource) {
            if ($resource !== 'users' && $resource !== 'settings') {
                $basicReadPerms[] = $allPermissions[$resource.'.read'];
            }
        }

        if ($viewer) $viewer->permissions()->sync($basicReadPerms);
        if ($subscriber) $subscriber->permissions()->sync($basicReadPerms);
    }
}
