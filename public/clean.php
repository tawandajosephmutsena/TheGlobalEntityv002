<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
echo "<h2>Final Restoration Script</h2>";
$oldUrl = 'http://ottostart.test';
$oldUrlEscaped = 'http:\/\/ottostart.test';
$newUrl = 'https://wisti-conference.co.zw';
// Every table that might hold a URL
$tables = [
    'settings' => ['value'],
    'pages' => ['content'],
    'content_versions' => ['content_data'],
    'media_assets' => ['path', 'folder', 'filename'],
    'portfolio_items' => ['content', 'description', 'thumbnail'],
    'services' => ['content', 'description', 'featured_image'],
    'insights' => ['content', 'summary', 'featured_image'],
    'navigation_menu_items' => ['url']
];
foreach ($tables as $table => $columns) {
    if (!Schema::hasTable($table)) continue;
    foreach ($columns as $column) {
        if (!Schema::hasColumn($table, $column)) continue;
        
        // Fix standard URL
        DB::statement("UPDATE $table SET $column = REPLACE($column, '$oldUrl', '$newUrl')");
        // Fix JSON-escaped URL
        DB::statement("UPDATE $table SET $column = REPLACE($column, '$oldUrlEscaped', '$newUrl')");
    }
    echo "✅ Cleaned table: $table<br>";
}
// Clear ALL Caches
\Illuminate\Support\Facades\Cache::flush();
\Illuminate\Support\Facades\Artisan::call('config:clear');
\Illuminate\Support\Facades\Artisan::call('view:clear');
echo "<h3>3. Clearing Browser Service Worker</h3>";
echo "<p>Please press <b>Cmd+Shift+R</b> (Mac) or <b>Ctrl+F5</b> (Windows) to force the browser to ignore the old 'broken' cache.</p>";
echo "<h2>DONE!</h2>";