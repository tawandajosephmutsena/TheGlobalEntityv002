<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $podcast = \Modules\PodcastPlugin\Models\Podcast::create([
        'title' => 'test directly',
        'media_url' => 'test.mp3',
        'media_type' => 'audio',
    ]);
    echo "SUCCESS: " . $podcast->id . "\n";
} catch (\Throwable $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
