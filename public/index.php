<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

/*
|--------------------------------------------------------------------------
| cPanel Deployment Configuration
|--------------------------------------------------------------------------
|
| This file has been configured for cPanel shared hosting where:
| - Laravel app root: /home/ottomate/ottomate/
| - Public files:     /home/ottomate/public_html/
|
*/

// Path to Laravel app root (relative to public_html)
$laravelRoot = is_dir(__DIR__ . '/../ottomate') ? __DIR__ . '/../ottomate' : __DIR__ . '/..';

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = $laravelRoot . '/storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require $laravelRoot . '/vendor/autoload.php';

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once $laravelRoot . '/bootstrap/app.php';

// Set the public path to THIS directory (public_html on cPanel)
$app->usePublicPath(__DIR__);

$app->handleRequest(Request::capture());

