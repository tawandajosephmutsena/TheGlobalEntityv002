<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

// 1. First Load
$request = Illuminate\Http\Request::create('/', 'GET');
$response = $kernel->handle($request);
preg_match('/&quot;version&quot;:&quot;([^&]+)&quot;/', $response->getContent(), $matches);
$version = $matches[1] ?? '';

// 2. Partial Reload for specific props (common in Inertia nav)
$request2 = Illuminate\Http\Request::create('/services', 'GET');
$request2->headers->set('X-Inertia', 'true');
$request2->headers->set('X-Inertia-Version', $version);
$request2->headers->set('X-Inertia-Partial-Data', 'services,categories');
$request2->headers->set('X-Inertia-Partial-Component', 'Services/Index');
$response2 = $kernel->handle($request2);
$content = json_decode($response2->getContent(), true);

echo "Partial Load Props:\n";
print_r(array_keys($content['props'] ?? []));

echo "\nDoes it have 'site'? " . (isset($content['props']['site']) ? 'YES' : 'NO') . "\n";
