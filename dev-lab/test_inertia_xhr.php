<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

// Need the full inertia version to avoid 409
$request = Illuminate\Http\Request::create('/', 'GET');
$response = $kernel->handle($request);
preg_match('/&quot;version&quot;:&quot;([^&]+)&quot;/', $response->getContent(), $matches);
$version = $matches[1] ?? '';

$request = Illuminate\Http\Request::create('/', 'GET');
$request->headers->set('X-Inertia', 'true');
$request->headers->set('X-Inertia-Version', $version);
$response = $kernel->handle($request);
$data = json_decode($response->getContent(), true);
print_r(array_keys($data['props']));
