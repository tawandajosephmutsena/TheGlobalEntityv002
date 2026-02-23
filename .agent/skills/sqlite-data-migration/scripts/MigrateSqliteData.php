<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class MigrateSqliteData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:migrate-sqlite-data';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Migrate data from an old SQLite database to the current one, keeping columns that exist in the new one and ignoring others.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $oldDbPath = '/Users/mac/Herd/agent/database.sqlite';
        $newDbPath = database_path('database.sqlite');
        
        if (!file_exists($oldDbPath)) {
            $this->error("Old database not found at {$oldDbPath}");
            return;
        }

        // Configure connection dynamically
        config(['database.connections.sqlite_old' => [
            'driver' => 'sqlite',
            'database' => $oldDbPath,
            'foreign_key_constraints' => false,
        ]]);

        $oldDb = \Illuminate\Support\Facades\DB::connection('sqlite_old');
        $newDb = \Illuminate\Support\Facades\DB::connection('sqlite');

        // We execute raw SQL to get tables correctly without Laravel getting in the way
        $tables = $oldDb->select("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");

        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();

        foreach ($tables as $tableRow) {
            $table = $tableRow->name;
            
            // Skip migrations and empty stuff
            if ($table === 'migrations') {
                continue;
            }
            
            if (!\Illuminate\Support\Facades\Schema::hasTable($table)) {
                $this->warn("Table '{$table}' does not exist in the new database, skipping.");
                continue;
            }
            
            $newColumns = \Illuminate\Support\Facades\Schema::getColumnListing($table);
            $oldRows = $oldDb->table($table)->get();
            
            $presetRows = $newDb->table($table)->get();
            if ($presetRows->count() > 0) {
                $newDb->table($table)->delete();
            }
            
            $this->info("Migrating " . count($oldRows) . " rows for table '{$table}'...");
            
            $insertData = [];
            foreach ($oldRows as $row) {
                $data = (array) $row;
                $newData = [];
                // Only keep keys that exist in the new table schema
                foreach ($data as $key => $value) {
                    if (in_array($key, $newColumns)) {
                        $newData[$key] = $value;
                    }
                }
                $insertData[] = $newData;
                
                if (count($insertData) >= 500) {
                    $newDb->table($table)->insert($insertData);
                    $insertData = [];
                }
            }
            
            if (count($insertData) > 0) {
                $newDb->table($table)->insert($insertData);
            }

            if ($presetRows->count() > 0) {
                $presetInsertData = [];
                foreach ($presetRows as $pRow) {
                    $pData = (array) $pRow;
                    unset($pData['id']);
                    $presetInsertData[] = $pData;
                }
                $newDb->table($table)->insert($presetInsertData);
                $this->info("Re-inserted " . count($presetInsertData) . " preset rows for table '{$table}'.");
            }
        }

        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

        $this->info("Data migration completed successfully.");
    }
}
