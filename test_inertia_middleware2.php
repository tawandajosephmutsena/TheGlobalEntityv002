<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

// Simulate first load
$request = Illuminate\Http\Request::create('/', 'GET');
$response = $kernel->handle($request);
preg_match('/&quot;version&quot;:&quot;([^&]+)&quot;/', $response->getContent(), $matches);
$version = $matches[1] ?? '';

// Simulate inertia navigation
$request2 = Illuminate\Http\Request::create('/services', 'GET');
$request2->headers->set('X-Inertia', 'true');
$request2->headers->set('X-Inertia-Version', $version);
$response2 = $kernel->handle($request2);
$content = json_decode($response2->getContent(), true);

echo "Version: $version\n";
echo "PROPS SITE IN /SERVICES:\n";
print_r(array_keys($content['props'] ?? []));
