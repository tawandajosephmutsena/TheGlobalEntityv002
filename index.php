<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

/**
 * OttoStart - Production Root Bridge
 * This file allows Laravel to run from the root directory when /public cannot be set as document root.
 */

// Enable emergency error reporting for early bootstrap debugging
error_reporting(E_ALL);
ini_set('display_errors', '1');

// 1. Load the Composer autoloader
if (!file_exists(__DIR__.'/vendor/autoload.php')) {
    die('Error: /vendor/autoload.php not found. Please run "composer install" or ensure the vendor folder was uploaded.');
}
require __DIR__.'/vendor/autoload.php';

// 2. Bootstrap Laravel
try {
    /** @var Application $app */
    $app = require_once __DIR__.'/bootstrap/app.php';
} catch (\Throwable $e) {
    echo "<h1>Bootstrap Error</h1>";
    echo "<p>Message: " . $e->getMessage() . "</p>";
    echo "<p>File: " . $e->getFile() . " (Line: " . $e->getLine() . ")</p>";
    echo "<pre>" . $e->getTraceAsString() . "</pre>";
    die();
}

// 3. Set the public path to /public
$app->usePublicPath(__DIR__.'/public');

// 4. Handle the request
$app->handleRequest(Request::capture());
