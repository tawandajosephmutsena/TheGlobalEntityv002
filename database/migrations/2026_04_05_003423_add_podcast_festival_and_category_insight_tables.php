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
        Schema::table('insights', function (Blueprint $table) {
            // Nullable links for external/plugin modules. Constrained without foreign keys
            // to avoid strict coupling if the podcast plugin is disabled/removed.
            $table->unsignedBigInteger('podcast_id')->nullable();
            $table->foreignId('festival_id')->nullable()->constrained('festivals')->nullOnDelete();
        });

        Schema::create('category_insight', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->foreignId('insight_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            
            $table->unique(['category_id', 'insight_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('category_insight');
        Schema::table('insights', function (Blueprint $table) {
            $table->dropColumn('podcast_id');
            $table->dropForeign(['festival_id']);
            $table->dropColumn('festival_id');
        });
    }
};
