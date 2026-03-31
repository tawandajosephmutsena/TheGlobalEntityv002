<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$request = Illuminate\Http\Request::create('/', 'GET');
$request->headers->set('X-Inertia', 'true');
$response = $kernel->handle($request);
$data = json_decode($response->getContent(), true);
print_r($data['props']['site']);
