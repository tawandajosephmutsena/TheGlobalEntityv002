<?php
/**
 * OttoStart cPanel Deployment Fixer v2
 * Use this after updating files to fix permissions and clear cache.
 */

$appRoot = __DIR__;
$results = [];

echo "<h1>🛠️ OttoStart Deployment Fixer (v2)</h1>";

// 1. Fix Permissions
echo "<h3>1. Checking Permissions...</h3>";
$pathsToFix = [
    'storage',
    'storage/app',
    'storage/framework',
    'storage/framework/cache',
    'storage/framework/sessions',
    'storage/framework/views',
    'storage/logs',
    'bootstrap/cache',
    'database'
];

foreach ($pathsToFix as $path) {
    if (is_dir("$appRoot/$path")) {
        chmod("$appRoot/$path", 0755);
        $results[] = "✅ Set 0755 on /$path";
    } else {
        @mkdir("$appRoot/$path", 0755, true);
        $results[] = "📁 Created/Fixed directory /$path";
    }
}

// 2. Fix .env Path and Filesystem
echo "<h3>2. Syncing Environment...</h3>";
if (file_exists("$appRoot/.env")) {
    $content = file_get_contents("$appRoot/.env");
    $dbPath = "$appRoot/database/database.sqlite";
    
    // Auto-fix DB path
    $content = preg_replace('/DB_DATABASE=.*/', "DB_DATABASE=$dbPath", $content);
    $content = preg_replace('/APP_DEBUG=.*/', "APP_DEBUG=false", $content);
    
    // CRITICAL: Fix the hardcoded Mac storage path
    $serverPublicStorage = "$appRoot/public/storage";
    $content = preg_replace('/FILESYSTEM_ROOT_PUBLIC=.*/', "FILESYSTEM_ROOT_PUBLIC=$serverPublicStorage", $content);
    
    file_put_contents("$appRoot/.env", $content);
    $results[] = "✅ Updated DB_DATABASE to server path: $dbPath";
    $results[] = "✅ Updated FILESYSTEM_ROOT_PUBLIC to: $serverPublicStorage";
}

// 2.5 Handle Symbolic Link
echo "<h3>2.5 Fixing Storage Link...</h3>";
$publicStorageLink = "$appRoot/public/storage";
$actualStoragePath = "$appRoot/storage/app/public";

if (file_exists($publicStorageLink) && !is_link($publicStorageLink)) {
    // If it's a real directory instead of a link, that's fine for shared hosting
    chmod($publicStorageLink, 0755);
    $results[] = "✅ /public/storage is a real directory (Good for shared hosting)";
} elseif (!file_exists($publicStorageLink)) {
    // Try to create it as a directory if symlink is hard on this server
    if (@mkdir($publicStorageLink, 0755, true)) {
        $results[] = "✅ Created /public/storage as a directory";
    } else {
        $results[] = "⚠️ Could not create /public/storage. Please create it manually via File Manager.";
    }
}


// 3. FORCE CLEAR CACHE (Crucial for CSP changes)
echo "<h3>3. Clearing Laravel System Cache...</h3>";
$cacheFiles = [
    "$appRoot/bootstrap/cache/config.php",
    "$appRoot/bootstrap/cache/routes-v7.php",
    "$appRoot/bootstrap/cache/services.php",
    "$appRoot/bootstrap/cache/packages.php"
];

foreach ($cacheFiles as $file) {
    if (file_exists($file)) {
        unlink($file);
        $results[] = "🧹 Deleted stale cache: " . basename($file);
    }
}

// Output Results
echo "<ul>";
foreach (array_unique($results) as $res) {
    echo "<li>$res</li>";
}
echo "</ul>";

echo "<hr><p><b>Next Step:</b> Try visiting <a href='/'>your site</a>. If errors persist, check browser console for new CSP messages.</p>";
