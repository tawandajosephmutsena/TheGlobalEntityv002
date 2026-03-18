<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$request = Illuminate\Http\Request::create('/services', 'GET');
$request->headers->set('X-Inertia', 'true');
$request->headers->set('X-Inertia-Version', 'test');
$response = $kernel->handle($request);

$content = json_decode($response->getContent(), true);
echo "PROPS SITE IN /SERVICES:\n";
print_r(array_keys($content['props'] ?? []));
if(isset($content['props']['site'])) {
  echo "\nHas Site: Yes\n";
  echo "Site Keys: " . implode(', ', array_keys($content['props']['site']));
} else {
  echo "\nHas Site: NO\n";
}
