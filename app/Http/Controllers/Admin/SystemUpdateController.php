<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class SystemUpdateController extends Controller
{
    /**
     * Update the system by pulling from GitHub and running necessary commands.
     */
    public function update(Request $request)
    {
        $basePath = base_path();

        // 1. Git pull
        try {
            // First fetch
            $process = new Process(['git', 'fetch', 'origin'], $basePath);
            $process->setTimeout(120);
            $process->mustRun();

            // Then pull
            $process = new Process(['git', 'pull', 'origin', 'main'], $basePath);
            $process->setTimeout(120);
            $process->mustRun();
        } catch (ProcessFailedException $exception) {
            Log::error('Git pull failed: ' . $exception->getMessage());
            return back()->with('error', 'Failed to pull from GitHub. Check logs for details.');
        }

        // 2. Composer install (optional, but good practice if composer.json changed)
        try {
            // we use php and composer.phar if possible, or just global composer
            // using an array here because composer might be aliased, but usually 'composer' works in modern setups
            $composerPath = trim(shell_exec('which composer'));
            if (!$composerPath) {
                // fallback to composer.phar in base path if it exists
                if (file_exists($basePath . '/composer.phar')) {
                    $composerPath = 'php ' . $basePath . '/composer.phar';
                } else {
                    $composerPath = 'composer';
                }
            }

            // A bit tricky to pass as array if it's "php composer.phar", so we use fromShellCommandline
            $process = Process::fromShellCommandline("$composerPath install --no-interaction --prefer-dist --optimize-autoloader", $basePath);
            $process->setTimeout(300);
            $process->mustRun();
        } catch (ProcessFailedException $exception) {
            Log::error('Composer install failed: ' . $exception->getMessage());
            // We might not fail completely if composer fails, but let's report it
        }

        // 3. Migrate database (force is required in production)
        try {
            $process = new Process(['php', 'artisan', 'migrate', '--force'], $basePath);
            $process->setTimeout(300);
            $process->mustRun();
        } catch (ProcessFailedException $exception) {
            Log::error('Migration failed: ' . $exception->getMessage());
            return back()->with('error', 'Failed to run migrations. Check logs for details.');
        }

        // 4. Clear optimizing caches
        try {
            $process = new Process(['php', 'artisan', 'optimize:clear'], $basePath);
            $process->mustRun();
        } catch (\Exception $e) {
            Log::error('Failed to clear cache: ' . $e->getMessage());
        }

        // Clear the cached app version
        Cache::forget('app_version');

        return back()->with('success', 'System updated successfully!');
    }
}
