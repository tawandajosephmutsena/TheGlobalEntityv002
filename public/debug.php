<?php
// This bypasses standard caching to see the raw values
$env_file = __DIR__.'/../.env';
$content = file_get_contents($env_file);
echo "<h1>Environment Debug</h1>";
echo "<strong>Checking .env file existence:</strong> " . (file_exists($env_file) ? "Found" : "NOT FOUND") . "<br>";
// Load Laravel to see what it thinks
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();
echo "<strong>Laravel Config URL:</strong> " . config('app.url') . "<br>";
echo "<strong>Laravel Env URL:</strong> " . env('APP_URL') . "<br>";
echo "<strong>Asset URL Test:</strong> " . asset('storage/test.jpg') . "<br>";