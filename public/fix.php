<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();
use Illuminate\Support\Facades\DB;
echo "<h2>Cleaning Database (V2)...</h2>";
$oldUrl = 'http://ottostart.test';
$newUrl = 'https://wisti-conference.co.zw';
// 1. Update Settings table
DB::statement("UPDATE settings SET value = REPLACE(value, '$oldUrl', '$newUrl')");
echo "Cleaned Settings table.<br>";
// 2. Update Pages table (uses 'content' column)
DB::statement("UPDATE pages SET content = REPLACE(content, '$oldUrl', '$newUrl')");
echo "Cleaned Pages table.<br>";
// 3. Update Content Versions table (uses 'content_data' column)
DB::statement("UPDATE content_versions SET content_data = REPLACE(content_data, '$oldUrl', '$newUrl')");
echo "Cleaned Content Versions table.<br>";
// 4. Update Insights/Blogs (if they have content)
if (Schema::hasTable('insights')) {
    DB::statement("UPDATE insights SET content = REPLACE(content, '$oldUrl', '$newUrl')");
    echo "Cleaned Insights table.<br>";
}
// 5. Clear Cache
\Illuminate\Support\Facades\Cache::flush();
echo "Cache cleared.<br>";
echo "<h3>Done! Refresh your site now.</h3>";