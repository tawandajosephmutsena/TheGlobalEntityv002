<?php
/**
 * cPanel Symlink & Path Fixer (v2 - Robust)
 * Upload to your public_html/ (or public/) folder.
 */

// 1. SET YOUR ACTUAL BASE PATH HERE IF DETECTED WRONG
$actualUser = "datcitiz"; // Based on your screenshot
$basePath = "/home/$actualUser/notherchoice";
$publicPath = __DIR__;

echo "<h1>cPanel Path Fixer v2</h1>";
echo "<ul>";
echo "<li>Detected Base: <code>$basePath</code></li>";
echo "<li>Public Folder: <code>$publicPath</code></li>";
echo "</ul>";

// 2. Clear existing broken link/folder
$linkPath = $publicPath . '/storage';

if (file_exists($linkPath) || is_link($linkPath)) {
    echo "<p>Removing old link/folder at <code>$linkPath</code>...</p>";
    if (is_link($linkPath)) {
        unlink($linkPath);
    } else {
        // It's a directory, rename it
        rename($linkPath, $linkPath . '_old_' . time());
    }
}

// 3. Create fresh Symlink
$targetPath = $basePath . '/storage/app/public';

if (!is_dir($targetPath)) {
    echo "<p style='color:red;'>ERROR: Target storage directory does not exist at <code>$targetPath</code>. Please create it manually via File Manager.</p>";
} else {
    if (symlink($targetPath, $linkPath)) {
        echo "<p style='color:green; font-weight:bold;'>SUCCESS: Storage link created!</p>";
        echo "<p>Now try uploading images in your dashboard.</p>";
    } else {
        echo "<p style='color:red;'>ERROR: Symlink failed. Your host may have disabled the 'symlink' function.</p>";
    }
}

echo "<hr><p><b>Security Note</b>: Please DELETE this file (<code>fix_cpanel_v2.php</code>) immediately after use.</p>";
?>
