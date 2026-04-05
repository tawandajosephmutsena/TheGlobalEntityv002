<?php
/**
 * OttoStart cPanel Deployment Helper - DIRECT DATABASE FIX
 * 
 * This script will DIRECTLY update your database to fix broken image links.
 * It does not require any other files to be uploaded.
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

// ============================================
// SECURITY CONFIGURATION
// ============================================
$secretKey = 'ottostart-deploy-2026-change-me-immediately';

if (!isset($_GET['key']) || $_GET['key'] !== $secretKey) {
    http_response_code(403);
    die('Access Denied. Invalid or missing key.');
}

set_time_limit(600);
ini_set('memory_limit', '512M');

// ============================================
// PATH DETECTION
// ============================================

function findLaravelRoot() {
    $currentDir = __DIR__;
    $searchPaths = [
        $currentDir,
        dirname($currentDir),
        dirname(dirname($currentDir)),
        dirname($currentDir) . '/tge',
        dirname($currentDir) . '/ottomate',
        dirname($currentDir) . '/otto_main_site_01',
    ];
    
    foreach ($searchPaths as $path) {
        if (file_exists($path . '/artisan') && file_exists($path . '/.env')) {
            return realpath($path);
        }
    }
    return null;
}

$laravelRoot = findLaravelRoot();

// ============================================
// DATABASE HELPER
// ============================================

function getDbConnection($laravelRoot) {
    if (!$laravelRoot || !file_exists($laravelRoot . '/.env')) {
        throw new Exception("Could not find .env file at $laravelRoot");
    }

    $env = file_get_contents($laravelRoot . '/.env');
    preg_match('/DB_HOST=(.*)/', $env, $host);
    preg_match('/DB_DATABASE=(.*)/', $env, $db);
    preg_match('/DB_USERNAME=(.*)/', $env, $user);
    preg_match('/DB_PASSWORD=(.*)/', $env, $pass);
    preg_match('/DB_PORT=(.*)/', $env, $port);

    $host = trim($host[1] ?? '127.0.0.1');
    $db = trim($db[1] ?? '');
    $user = trim($user[1] ?? '');
    $pass = trim($pass[1] ?? '');
    $port = trim($port[1] ?? '3306');

    // Remove quotes if present
    $host = trim($host, '"\'');
    $db = trim($db, '"\'');
    $user = trim($user, '"\'');
    $pass = trim($pass, '"\'');

    $dsn = "mysql:host=$host;dbname=$db;port=$port;charset=utf8mb4";
    return new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
}

function runDirectFix($laravelRoot) {
    try {
        $pdo = getDbConnection($laravelRoot);
        $stmt = $pdo->query("SELECT id, title, content FROM pages");
        $pages = $stmt->fetchAll();
        
        $updatedCount = 0;
        $search = 'tge.test/storage';
        $replace = '/storage';
        
        // Escaped versions for JSON
        $searchEscaped = str_replace('/', '\\/', $search);
        $replaceEscaped = str_replace('/', '\\/', $replace);

        foreach ($pages as $page) {
            $content = $page['content'];
            if (empty($content)) continue;

            $newContent = str_replace($search, $replace, $content);
            $newContent = str_replace($searchEscaped, $replaceEscaped, $newContent);

            if ($content !== $newContent) {
                $updateStmt = $pdo->prepare("UPDATE pages SET content = ?, updated_at = NOW() WHERE id = ?");
                $updateStmt->execute([$newContent, $page['id']]);
                $updatedCount++;
            }
        }
        
        return [
            'success' => true,
            'message' => "Successfully updated $updatedCount pages directly in the database.",
            'details' => "Replaced '$search' with '$replace' in the 'pages' table."
        ];
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => "Database Error: " . $e->getMessage()
        ];
    }
}

// ============================================
// ACTION HANDLER
// ============================================

$action = $_GET['action'] ?? null;
$directResult = null;

if ($action === 'direct_fix') {
    $directResult = runDirectFix($laravelRoot);
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OttoStart Emergency Fix</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-slate-200 p-8">
    <div class="max-w-2xl mx-auto">
        <h1 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-600 mb-6 italic">⚡ Quick Fix Tool</h1>
        
        <?php if ($directResult): ?>
            <div class="p-6 rounded-xl border mb-8 <?php echo $directResult['success'] ? 'bg-green-900/20 border-green-500 text-green-200' : 'bg-red-900/20 border-red-500 text-red-200'; ?>">
                <h3 class="font-bold text-xl mb-2"><?php echo $directResult['success'] ? '✅ Success!' : '❌ Failed'; ?></h3>
                <p><?php echo $directResult['message']; ?></p>
                <?php if (isset($directResult['details'])): ?>
                    <p class="text-sm mt-2 opacity-70"><?php echo $directResult['details']; ?></p>
                <?php endif; ?>
            </div>
        <?php endif; ?>

        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
            <h2 class="text-xl font-semibold mb-4">Direct Database Repair</h2>
            <p class="text-slate-400 mb-6">This will bypass Artisan and modify the database directly. It looks into your <code>.env</code> file, connects to the DB, and replaces local URLs with relative ones.</p>
            
            <a href="?key=<?php echo $secretKey; ?>&action=direct_fix" class="block w-full py-4 text-center bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-900/20">
                🚀 RUN EMERGENCY DATABASE FIX
            </a>
        </div>

        <p class="mt-8 text-center text-slate-500 text-sm italic">Delete this file immediately after images are fixed.</p>
    </div>
</body>
</html>
