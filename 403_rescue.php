<?php
/**
 * OttoStart EMERGENCY 403 RECOVERY
 * This script fixes permissions and helps find the 403 cause.
 */

error_reporting(E_ALL);
ini_set('display_errors', '1');

echo "<html><head><style>body{font-family:sans-serif;line-height:1.5;padding:20px;background:#f4f4f4} .card{background:white;padding:20px;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1);margin-bottom:20px} .success{color:green} .error{color:red} .warn{color:orange} code{background:#eee;padding:2px 3px;border-radius:4px}</style></head><body>";
echo "<h1>🆘 403 Rescue Script</h1>";

// 1. Check Permissions
echo "<div class='card'><h2>🛡️ Permissions Check</h2>";
$paths = [
    'Current Dir' => __DIR__,
    'index.php' => __DIR__ . '/index.php',
    '.htaccess' => __DIR__ . '/.htaccess',
];

foreach ($paths as $name => $path) {
    if (file_exists($path)) {
        $perms = substr(sprintf('%o', fileperms($path)), -3);
        echo "<li>$name (<code>$perms</code>): ";
        if ($perms == '755' || $perms == '644') {
            echo "<span class='success'>✓ Correct</span>";
        } else {
            echo "<span class='error'>❌ INCORRECT (Should be 755 or 644)</span>";
            if (isset($_GET['fix_perms'])) {
                chmod($path, (is_dir($path) ? 0755 : 0644));
                echo " -> <span class='success'>Fixed!</span>";
            }
        }
        echo "</li>";
    } else {
        echo "<li>$name: <span class='error'>NOT FOUND</span></li>";
    }
}
if (!isset($_GET['fix_perms'])) {
    echo "<p><a href='?fix_perms=1' style='background:#22c55e;color:white;padding:5px 10px;text-decoration:none;border-radius:4px'>AUTO-FIX PERMISSIONS</a></p>";
}
echo "</div>";

// 2. .htaccess Debug
echo "<div class='card'><h2>📝 .htaccess Content Review</h2>";
if (file_exists(__DIR__ . '/.htaccess')) {
    $content = file_get_contents(__DIR__ . '/.htaccess');
    echo "<p>Checking for Forbidden [F] rules...</p>";
    if (strpos($content, '[F]') !== false || strpos($content, '[F,L]') !== false) {
        echo "<p class='warn'>⚠️ <b>Warning:</b> You have 'Forbidden' rules active. If you are trying to access a blocked folder (like <code>app/</code>), you will get a 403.</p>";
    }
    echo "<pre style='background:#222;color:#eee;padding:15px;overflow:auto;max-height:300px'>".htmlspecialchars($content)."</pre>";
}
echo "</div>";

// 3. Directory Index check
echo "<div class='card'><h2>🔍 Directory Index</h2>";
if (file_exists(__DIR__ . '/index.php')) {
    echo "<p class='success'>✓ <code>index.php</code> exists. Your site should load it.</p>";
} else {
    echo "<p class='error'>❌ <code>index.php</code> MISSING! Your site has nothing to load.</p>";
}
echo "</div>";

echo "</body></html>";
