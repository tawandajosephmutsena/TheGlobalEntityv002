<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';

use App\Actions\Fortify\CreateNewUser;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\DB;

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Test data
$data = [
    'name' => 'Registration Test User',
    'email' => 'test-reg-' . time() . '@example.com',
    'password' => 'password123',
    'password_confirmation' => 'password123',
];

echo "Starting registration test...\n";

try {
    DB::beginTransaction();

    $creator = new CreateNewUser();
    $user = $creator->create($data);

    echo "User created: " . $user->email . "\n";
    echo "Default role in user table: " . $user->role . "\n";
    
    $roles = $user->roles->pluck('slug')->toArray();
    echo "Assigned RBAC roles: " . implode(', ', $roles) . "\n";

    if ($user->role === 'viewer' && in_array('viewer', $roles)) {
        echo "SUCCESS: Default viewer role assigned correctly.\n";
    } else {
        echo "FAILURE: Role mismatch.\n";
    }

    // Check email verification in local env
    if ($user->email_verified_at !== null) {
        echo "SUCCESS: User auto-verified in local environment.\n";
    }

    DB::rollBack();
    echo "Test completed and database rolled back.\n";
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    DB::rollBack();
}
