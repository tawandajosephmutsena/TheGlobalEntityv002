<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class ComplianceSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            [
                'key' => 'cookie_consent_enabled',
                'value' => 'true',
                'type' => 'boolean',
                'group_name' => 'compliance',
            ],
            [
                'key' => 'cookie_consent_message',
                'value' => 'We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.',
                'type' => 'text',
                'group_name' => 'compliance',
            ],
            [
                'key' => 'cookie_consent_accept_text',
                'value' => 'Accept All',
                'type' => 'text',
                'group_name' => 'compliance',
            ],
            [
                'key' => 'cookie_consent_reject_text',
                'value' => 'Reject Non-Essential',
                'type' => 'text',
                'group_name' => 'compliance',
            ],
            [
                'key' => 'cookie_consent_style',
                'value' => 'bottom-bar',
                'type' => 'text',
                'group_name' => 'compliance',
            ],
            [
                'key' => 'analytics_enabled',
                'value' => 'false',
                'type' => 'boolean',
                'group_name' => 'compliance',
            ],
            [
                'key' => 'privacy_policy_page',
                'value' => '/privacy',
                'type' => 'text',
                'group_name' => 'compliance',
            ],
            [
                'key' => 'terms_page',
                'value' => '/terms',
                'type' => 'text',
                'group_name' => 'compliance',
            ],
            [
                'key' => 'cookie_policy_page',
                'value' => '/cookies',
                'type' => 'text',
                'group_name' => 'compliance',
            ],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }

        $this->command->info('Compliance settings seeded successfully.');
    }
}
