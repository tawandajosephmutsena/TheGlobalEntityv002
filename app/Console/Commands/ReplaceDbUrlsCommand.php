<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ReplaceDbUrlsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:replace-url
                            {search : The URL or string to search for (e.g. http://tge.test)}
                            {replace : The URL or string to replace it with (e.g. https://tge001.ottomate.space)}
                            {--force : Force the operation to run when in production}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Search and replace a specific URL across all tables in the database.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $search = $this->argument('search');
        $replace = $this->argument('replace');

        $this->warn("You are about to scan the entire database and replace:");
        $this->info("SEARCH:  {$search}");
        $this->info("REPLACE: {$replace}");

        if (! $this->option('force') && ! $this->confirm('Do you wish to continue?', false)) {
            $this->comment('Operation cancelled.');
            return;
        }

        $tables = Schema::getTables();
        $totalReplacements = 0;

        $this->output->progressStart(count($tables));

        foreach ($tables as $table) {
            $tableName = $table['name'];

            // Skip sqlite system tables and migration/job tracking tables
            if (in_array($tableName, ['sqlite_sequence', 'migrations', 'failed_jobs', 'jobs', 'job_batches', 'cache', 'cache_locks', 'sessions'])) {
                $this->output->progressAdvance();
                continue;
            }

            $columns = Schema::getColumns($tableName);
            
            // Only search in text-like columns
            $textTypes = ['string', 'text', 'json', 'longtext', 'mediumtext', 'varchar'];
            $columnsToUpdate = [];

            foreach ($columns as $column) {
                if (in_array(strtolower($column['type_name']), $textTypes)) {
                    $columnsToUpdate[] = $column['name'];
                }
            }

            if (empty($columnsToUpdate)) {
                $this->output->progressAdvance();
                continue;
            }

            try {
                // Because we might have multiple columns to replace in the same table,
                // we'll update them one by one or build a complex query.
                // SQLite string replacement works beautifully with REPLACE()
                foreach ($columnsToUpdate as $col) {
                    $count = DB::table($tableName)
                        ->where($col, 'LIKE', '%' . $search . '%')
                        ->update([
                            $col => DB::raw("REPLACE({$col}, '{$search}', '{$replace}')")
                        ]);

                    if ($count > 0) {
                        $totalReplacements += $count;
                        $this->newLine();
                        $this->line("Updated {$count} rows in {$tableName}.{$col}");
                    }
                }
            } catch (\Exception $e) {
                $this->newLine();
                $this->error("Error updating table {$tableName}: " . $e->getMessage());
            }

            $this->output->progressAdvance();
        }

        $this->output->progressFinish();

        $this->info("Successfully executed search and replace! Adjusted {$totalReplacements} fields.");
        $this->comment("Notice: It is highly recommended to run `php artisan cache:clear` and `php artisan optimize:clear` after doing this.");
    }
}
