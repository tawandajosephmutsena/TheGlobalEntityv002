<?php
/**
 * UPLOAD DIAGNOSTIC TOOL
 * Upload this to your public/ folder and visit it in your browser.
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

function check_permission($path) {
    if (!file_exists($path)) return "❌ Not found";
    return is_writable($path) ? "✅ Writable" : "❌ Not writable";
}

$public_path = __DIR__;
$base_path = dirname($public_path);
$storage_link = $public_path . '/storage';
$storage_actual = $base_path . '/storage/app/public';

echo "<h1>Upload Diagnostic Tool</h1>";

echo "<h3>1. PHP Configuration</h3>";
echo "upload_max_filesize: " . ini_get('upload_max_filesize') . "<br>";
echo "post_max_size: " . ini_get('post_max_size') . "<br>";
echo "memory_limit: " . ini_get('memory_limit') . "<br>";

echo "<h3>2. Directory Permissions</h3>";
echo "Base Storage: " . $base_path . '/storage/app/public - ' . check_permission($storage_actual) . "<br>";
echo "Temporary Uploads: " . ini_get('upload_tmp_dir') ?: '/tmp' . ' - ' . check_permission(ini_get('upload_tmp_dir') ?: '/tmp') . "<br>";

echo "<h3>3. Symlink Check</h3>";
if (file_exists($storage_link)) {
    if (is_link($storage_link)) {
        $target = readlink($storage_link);
        echo "✅ public/storage exists and is a symlink.<br>";
        echo "Target: $target<br>";
        if (file_exists($target)) {
            echo "✅ Symlink target exists.";
        } else {
            echo "❌ Symlink target does NOT exist! (Broken link)";
        }
    } else {
        echo "❌ public/storage is a DIRECTORY, not a symlink. This usually causes issues. Delete it and run storage:link.";
    }
} else {
    echo "❌ public/storage is MISSING. Run 'php artisan storage:link'";
}

echo "<h3>4. .env Path Verification</h3>";
$env_path = $base_path . '/.env';
if (file_exists($env_path)) {
    $env_content = file_get_contents($env_path);
    if (strpos($env_content, 'datciz') !== false) {
        echo "⚠️ WARNING: Found 'datciz' in .env. It should likely be 'datcitiz'.<br>";
    } else {
        echo "✅ No obvious typos found in .env paths.";
    }
} else {
    echo "❌ .env file not found at $env_path";
}

echo "<h3>5. Physical Write Test</h3>";
$test_file = $storage_actual . '/test_write.txt';
if (@file_put_contents($test_file, "Test at " . date('Y-m-d H:i:s'))) {
    echo "✅ Successfully wrote test file to storage.";
    @unlink($test_file);
} else {
    $error = error_get_last();
    echo "❌ FAILED to write test file: " . $error['message'];
}

echo "<hr><p>Please upload a screenshot of this page if you need more help.</p>";
