<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$request = Illuminate\Http\Request::create('/', 'GET');
$response = $kernel->handle($request);
preg_match('/data-page="([^"]+)"/', $response->getContent(), $matches);
if (isset($matches[1])) {
    $data = json_decode(html_entity_decode($matches[1]), true);
    print_r(array_keys($data['props']));
    print_r(array_keys($data['props']['site'] ?? []));
} else {
    echo "No page data found.";
}
