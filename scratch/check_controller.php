<?php
require __DIR__ . '/../vendor/autoload.php';
try {
    $reflection = new ReflectionClass('Modules\PodcastPlugin\Http\Controllers\PodcastPublicController');
    echo "File: " . $reflection->getFileName() . "\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
