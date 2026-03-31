<?php
/**
 * OttoStart "Two Websites" Fixer (v5)
 * HUNTS for conflicting index.html files and DB issues.
 */

error_reporting(E_ALL);
ini_set('display_errors', '1');

echo "<html><head><style>body{font-family:sans-serif;line-height:1.5;padding:20px;background:#f4f4f4} .card{background:white;padding:20px;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1);margin-bottom:20px} .success{color:green} .error{color:red} .warn{color:orange} code{background:#eee;padding:2px 4px;border-radius:4px}</style></head><body>";
echo "<h1>🕵️ Conflict Hunter v5</h1>";

$root = realpath(__DIR__);
if (!file_exists($root . '/artisan')) {
    $root = realpath(__DIR__ . '/..');
}

// 1. Conflict Hunter
echo "<div class='card'><h2>🤺 File Conflict Hunter</h2>";
$conflicts = ['index.html', 'index.htm', 'default.php', 'default.html'];
$foundConflicts = false;
foreach ($conflicts as $file) {
    if (file_exists(__DIR__ . '/' . $file) && $file !== 'fix_cpanel.php') {
        echo "<p class='error'>❌ Found CONFLICT: <code>$file</code></p>";
        echo "<p>This file is likely preventing your real website from loading on the homepage.</p>";
        if (isset($_GET['delete_conflict']) && $_GET['delete_conflict'] == $file) {
            unlink(__DIR__ . '/' . $file);
            echo "<p class='success'>✓ Deleted $file!</p>";
        } else {
            echo "<a href='?delete_conflict=$file' style='background:red;color:white;padding:5px 10px;text-decoration:none;border-radius:4px'>DELETE $file NOW</a>";
        }
        $foundConflicts = true;
    }
}
if (!$foundConflicts) echo "<p class='success'>✓ No conflicting static files found in this directory.</p>";
echo "</div>";

// 2. Database Deep Dive
echo "<div class='card'><h2>🗄️ Database Integrity Check</h2>";
$dbPath = $root . '/database/database.sqlite';
if (!file_exists($dbPath)) {
    echo "<p class='error'>❌ Database MISSING at <code>$dbPath</code></p>";
} else {
    try {
        $pdo = new PDO("sqlite:" . $dbPath);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        $tableCount = $pdo->query("SELECT count(*) FROM sqlite_master WHERE type='table'")->fetchColumn();
        echo "<li><b>Tables found:</b> $tableCount</li>";
        
        if ($tableCount > 0) {
            $siteName = $pdo->query("SELECT value FROM settings WHERE key='site_name' LIMIT 1")->fetchColumn();
            echo "<li><b>Site name in DB:</b> <b class='success'>" . ($siteName ?: 'EMPTY') . "</b></li>";
            
            $projectCount = $pdo->query("SELECT count(*) FROM portfolio_items")->fetchColumn();
            echo "<li><b>Portfolio projects:</b> $projectCount</li>";
        } else {
            echo "<p class='error'>❌ Database is EMPTY. Upload your local database/database.sqlite to <code>$dbPath</code></p>";
        }
    } catch (\Exception $e) {
        echo "<p class='error'>❌ Connection Error: " . $e->getMessage() . "</p>";
    }
}
echo "</div>";

// 3. Cache Killer
echo "<div class='card'><h2>⚡ Cache Killer</h2>";
$caches = [
    $root . '/bootstrap/cache/config.php',
    $root . '/bootstrap/cache/routes-v7.php',
    $root . '/bootstrap/cache/packages.php',
    $root . '/bootstrap/cache/services.php',
    __DIR__ . '/hot'
];
foreach ($caches as $c) {
    if (file_exists($c)) {
        if (unlink($c)) echo "<li>🗑️ Cleared: <code>$c</code></li>";
    }
}
echo "<p>Caches cleared. Your site should now respect the latest settings.</p>";
echo "</div>";

echo "</body></html>";
