<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class GeneralSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            [
                'key' => 'site_name',
                'value' => 'Ottomate',
                'type' => 'text',
                'group_name' => 'general',
            ],
            [
                'key' => 'site_tagline',
                'value' => 'High-Performance Website Platform',
                'type' => 'text',
                'group_name' => 'general',
            ],
            [
                'key' => 'site_description',
                'value' => 'Ottomate: Professional, SEO-ready digital presences for small businesses that prioritize speed, complete ownership, and offline capabilities.',
                'type' => 'text',
                'group_name' => 'general',
            ],
            [
                'key' => 'site_logo',
                'value' => 'logo.svg',
                'type' => 'text',
                'group_name' => 'general',
            ],
            [
                'key' => 'brand_accent',
                'value' => '#ff6b35',
                'type' => 'color',
                'group_name' => 'theme',
            ],
            [
                'key' => 'font_display',
                'value' => 'Outfit',
                'type' => 'text',
                'group_name' => 'theme',
            ],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(['key' => $setting['key']], $setting);
        }
    }
}
