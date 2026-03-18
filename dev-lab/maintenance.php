<?php
/**
 * OttoStart Maintenance Script
 * Use this to run commands if you don't have SSH/Composer access.
 */

// Simple password protection (OPTIONAL - you can add a password check here)
// if ($_GET['key'] !== 'YOUR_SECRET_KEY') die('Unauthorized');

header('Content-Type: text/plain');

function run_cmd($cmd) {
    echo "Running: $cmd\n";
    $output = shell_exec($cmd . " 2>&1");
    echo $output . "\n";
    echo str_repeat('-', 40) . "\n";
}

echo "OttoStart Maintenance Output\n";
echo "============================\n\n";

// 1. Detect PHP binary
$php = PHP_BINARY;
echo "PHP Binary: $php\n";

// 2. Detect Composer
$composer = file_exists(__DIR__ . '/composer.phar') ? "$php " . __DIR__ . '/composer.phar' : 'composer';
echo "Composer Command: $composer\n\n";

$action = $_GET['action'] ?? 'status';

switch ($action) {
    case 'install':
        run_cmd("$composer install --no-dev --optimize-autoloader");
        break;

    case 'migrate':
        run_cmd("$php artisan migrate --force");
        break;

    case 'optimize':
        run_cmd("$php artisan optimize:clear");
        break;

    case 'dump':
        run_cmd("$composer dump-autoload");
        break;

    case 'status':
    default:
        echo "Available actions:\n";
        echo "?action=install  -> Run composer install\n";
        echo "?action=dump     -> Run composer dump-autoload\n";
        echo "?action=migrate  -> Run php artisan migrate\n";
        echo "?action=optimize -> Run php artisan optimize:clear\n";
        break;
}

echo "\n\nDONE. Please DELETE this file after use for security.";
