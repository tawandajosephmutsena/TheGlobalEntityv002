<?php

use App\Models\NavigationMenu;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        NavigationMenu::firstOrCreate(
            ['slug' => 'logo-menu'],
            [
                'name' => 'Logo Link',
                'location' => 'logo',
                'is_active' => true,
            ]
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $menu = NavigationMenu::where('slug', 'logo-menu')->first();
        if ($menu) {
            // Associated items will be handled by foreign key constraints or need explicit deletion depending on setup
            // Usually, deleting the menu also deletes navigation_menu_items via cascade if set up that way.
            $menu->delete();
        }
    }
};
