<?php
/**
 * EMERGENCY SITE RECOVERY (v3)
 * Use this if the whole site is broken (500 errors).
 * Upload to your public/ folder and visit in browser.
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>Emergency Recovery v3</h1>";

$publicPath = __DIR__;
$basePath = realpath($publicPath . '/..');

echo "<ul>";
echo "<li>Public: $publicPath</li>";
echo "<li>Base: $basePath</li>";
echo "</ul>";

// 1. RECOVERY: Clear Compiled Cache Files (The most common cause of 500s)
$cacheDirs = [
    $basePath . '/bootstrap/cache',
    $basePath . '/storage/framework/views',
    $basePath . '/storage/framework/cache',
    $basePath . '/storage/framework/sessions',
];

echo "<h3>Cleaning Compiled Caches:</h3><ul>";
foreach ($cacheDirs as $dir) {
    if (is_dir($dir)) {
        $files = glob($dir . '/*.php');
        foreach ($files as $file) {
            if (is_file($file)) {
                unlink($file);
                echo "<li>Deleted: " . basename($file) . "</li>";
            }
        }
        echo "<li>✓ Cleaned: $dir</li>";
    } else {
        echo "<li>! Directory missing: $dir (Creating it...)</li>";
        mkdir($dir, 0775, true);
    }
}
echo "</ul>";

// 2. RECOVERY: Fix Permissions
echo "<h3>Resetting Permissions:</h3><ul>";
foreach ($cacheDirs as $dir) {
    if (is_dir($dir)) {
        chmod($dir, 0775);
        echo "<li>Set 775: $dir</li>";
    }
}
echo "</ul>";

// 3. RECOVERY: Check Symlink
$link = $publicPath . '/storage';
if (file_exists($link) || is_link($link)) {
    echo "<p>✓ Storage link detected.</p>";
} else {
    echo "<p style='color:orange;'>! Storage link missing. Please use fix_cpanel_v2.php to fix it.</p>";
}

echo "<hr><p><b>Next Step</b>: Try visiting your site now. If it still shows 500, check your <code>.env</code> file for typos.</p>";
?>
