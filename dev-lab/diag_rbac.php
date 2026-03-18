<?php

use App\Models\User;
use Illuminate\Support\Facades\Auth;

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$email = 'test@example.com';
$user = User::where('email', $email)->first();

if (!$user) {
    echo "User not found: $email\n";
    exit(1);
}

echo "Diagnostic for: " . $user->email . "\n";
echo "Role Column: " . $user->role . "\n";
echo "isAdmin(): " . ($user->isAdmin() ? 'YES' : 'NO') . "\n";
echo "isEditor(): " . ($user->isEditor() ? 'YES' : 'NO') . "\n";
echo "isViewer(): " . ($user->isViewer() ? 'YES' : 'NO') . "\n";
echo "RBAC Roles: " . $user->roles->pluck('slug')->implode(', ') . "\n";
echo "Permissions: " . $user->permissions()->pluck('slug')->implode(', ') . "\n";

// Check the route logic manually
if ($user->isAdmin()) {
    echo "Logic: Redirect to admin.dashboard\n";
} elseif ($user->isEditor()) {
    echo "Logic: Redirect to admin.dashboard\n";
} else {
    echo "Logic: Render Dashboard\n";
}
