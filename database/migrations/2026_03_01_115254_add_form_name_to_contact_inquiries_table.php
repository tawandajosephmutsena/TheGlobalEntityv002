<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('contact_inquiries', function (Blueprint $table) {
            $table->string('form_name')->nullable()->after('subject');
        });

        // Backfill existing data using the subject
        DB::table('contact_inquiries')->orderBy('id')->chunk(500, function ($inquiries) {
            foreach ($inquiries as $inquiry) {
                if ($inquiry->subject) {
                    $formName = preg_replace('/\s*Submission$/', '', $inquiry->subject);
                    DB::table('contact_inquiries')
                        ->where('id', $inquiry->id)
                        ->update(['form_name' => $formName]);
                }
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contact_inquiries', function (Blueprint $table) {
            $table->dropColumn('form_name');
        });
    }
};
