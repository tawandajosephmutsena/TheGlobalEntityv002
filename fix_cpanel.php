<?php
/**
 * cPanel Fixer Script
 * Upload this to your public_html/ (or public/ if in subfolder) and visit it in your browser.
 */

define('LARAVEL_START', microtime(true));

// 1. Detect Base Path
$basePath = realpath(__DIR__ . '/..');
echo "<h1>cPanel Environment Fixer</h1>";
echo "<p>Base Path: <code>$basePath</code></p>";

// 2. Fix Storage Path
$publicStorage = __DIR__ . '/storage';
$actualStorage = $basePath . '/storage/app/public';

if (is_link($publicStorage)) {
    echo "<p style='color: green;'>✓ Storage link exists.</p>";
} else {
    echo "<p style='color: orange;'>! Storage link missing or is a directory. Fixing...</p>";
    if (is_dir($publicStorage)) {
        // Backup if it's a real directory with files
        rename($publicStorage, $publicStorage . '_backup_' . time());
    }
    
    if (symlink($actualStorage, $publicStorage)) {
        echo "<p style='color: green;'>✓ Storage link created successfully!</p>";
    } else {
        echo "<p style='color: red;'>✗ Failed to create storage link. Please check permissions.</p>";
    }
}

// 3. Fix Permissions
$folders = [
    $basePath . '/storage',
    $basePath . '/storage/logs',
    $basePath . '/storage/framework',
    $basePath . '/storage/framework/views',
    $basePath . '/storage/framework/cache',
    $basePath . '/bootstrap/cache',
];

echo "<h3>Checking Folder Permissions (775):</h3><ul>";
foreach ($folders as $folder) {
    if (!is_dir($folder)) {
        mkdir($folder, 0775, true);
    }
    chmod($folder, 0775);
    echo "<li>Fixed: <code>$folder</code></li>";
}
echo "</ul>";

// 4. Clear Cache
echo "<h3>Clearing Application Cache:</h3>";
try {
    require $basePath . '/vendor/autoload.php';
    $app = require_once $basePath . '/bootstrap/app.php';
    $kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
    
    $kernel->call('optimize:clear');
    echo "<pre>" . $kernel->output() . "</pre>";
    echo "<p style='color: green;'>✓ Cache cleared successfully.</p>";
} catch (\Exception $e) {
    echo "<p style='color: red;'>✗ Could not run artisan commands: " . $e->getMessage() . "</p>";
}

echo "<hr><p><b>Next Step</b>: Delete this script (<code>fix_cpanel.php</code>) from your server for security.</p>";
