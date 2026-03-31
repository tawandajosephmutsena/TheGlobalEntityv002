<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$request = Illuminate\Http\Request::create('/admin/podcasts', 'POST', [
    'title' => 'Test Podcast',
    'description' => 'A test podcast',
    'content' => '',
    'media_type' => 'audio',
    'is_published' => '1',
    'duration' => '120',
]);
$request->files->set('media_file', new \Illuminate\Http\UploadedFile(
    __DIR__.'/public/robots.txt',
    'robots.txt',
    'text/plain',
    null,
    true
));

$response = $kernel->handle($request);
echo "Status: " . $response->getStatusCode() . "\n";
if ($response->getStatusCode() == 302) {
    if (session()->has('errors')) {
        echo "Validation errors:\n";
        print_r(session()->get('errors')->toArray());
    }
}
