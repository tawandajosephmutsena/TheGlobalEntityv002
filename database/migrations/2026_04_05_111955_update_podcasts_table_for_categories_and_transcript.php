<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('podcasts', function (Blueprint $table) {
            // New category link (nullable for now)
            $table->unsignedBigInteger('category_id')->after('podcast_category_id')->nullable();
            
            // Transcript dynamic fields
            $table->string('transcript_url')->nullable()->after('content');
            $table->string('transcript_link_text')->nullable()->after('transcript_url');
        });

        // Pivot table for multiple categories
        Schema::create('category_podcast', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->foreignId('podcast_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['category_id', 'podcast_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('category_podcast');
        Schema::table('podcasts', function (Blueprint $table) {
            $table->dropColumn(['category_id', 'transcript_url', 'transcript_link_text']);
        });
    }
};
