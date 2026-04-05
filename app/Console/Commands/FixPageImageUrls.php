<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class FixPageImageUrls extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'page:fix-images {--search=tge.test/storage : The local URL pattern to search for} {--replace=/storage : The relative path to replace it with} {--dry-run : Only show what would be replaced without saving}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fix absolute local URLs in Page Builder content by converting them to relative paths';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $search = $this->option('search');
        $replace = $this->option('replace');
        $dryRun = $this->option('dry-run');

        $this->info("Searching for: {$search}");
        $this->info("Replacing with: {$replace}");

        if ($dryRun) {
            $this->warn("DRY RUN: No changes will be saved.");
        }

        try {
            // Using DB directly is safer than using a Model on a potentially broken live site
            $pages = DB::table('pages')->get();
            $updatedCount = 0;

            foreach ($pages as $page) {
                if (empty($page->content)) {
                    continue;
                }

                $content = $page->content;
                
                // If it's already a string (raw JSON), we can work with it
                // If it's cast to array/object, we encode it back for search/replace
                $isJson = is_string($content);
                $originalContentString = $isJson ? $content : json_encode($content);
                
                if (!$originalContentString) {
                    $this->error("Failed to encode content for Page ID: " . $page->id);
                    continue;
                }
                
                // Handle both normal slashes and escaped slashes in JSON
                $searchEscaped = str_replace('/', '\\/', $search);
                $replaceEscaped = str_replace('/', '\\/', $replace);

                $newContentString = str_replace($search, $replace, $originalContentString);
                $newContentString = str_replace($searchEscaped, $replaceEscaped, $newContentString);

                if ($originalContentString !== $newContentString) {
                    $this->line("Updating Page ID: {$page->id} - {$page->title}");
                    
                    if (!$dryRun) {
                        DB::table('pages')->where('id', $page->id)->update([
                            'content' => $newContentString, // Save the transformed JSON string directly
                            'updated_at' => now()
                        ]);
                    }
                    
                    $updatedCount++;
                }
            }

            $this->info("Total pages updated: {$updatedCount}");
        } catch (\Exception $e) {
            $this->error("Error: " . $e->getMessage());
            return Command::FAILURE;
        }
        
        return Command::SUCCESS;
    }
}
