<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('podcast_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('color', 7)->default('#7f13ec');
            $table->string('icon')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('podcasts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->longText('content')->nullable();
            $table->string('media_url');
            $table->enum('media_type', ['audio', 'video'])->default('audio');
            $table->string('thumbnail')->nullable();
            $table->integer('duration')->default(0); // seconds
            $table->unsignedBigInteger('file_size')->default(0); // bytes
            $table->foreignId('podcast_category_id')->nullable()->constrained('podcast_categories')->nullOnDelete();
            $table->foreignId('author_id')->nullable()->constrained('users')->nullOnDelete();
            $table->integer('season_number')->nullable();
            $table->integer('episode_number')->nullable();
            $table->json('tags')->nullable();
            $table->boolean('is_published')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->unsignedBigInteger('play_count')->default(0);
            $table->unsignedBigInteger('share_count')->default(0);
            $table->timestamps();

            $table->index(['is_published', 'published_at']);
            $table->index('podcast_category_id');
            $table->index('is_featured');
        });

        Schema::create('podcast_plays', function (Blueprint $table) {
            $table->id();
            $table->foreignId('podcast_id')->constrained('podcasts')->cascadeOnDelete();
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamp('played_at')->useCurrent();
            $table->integer('duration_listened')->default(0); // seconds

            $table->index(['podcast_id', 'played_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('podcast_plays');
        Schema::dropIfExists('podcasts');
        Schema::dropIfExists('podcast_categories');
    }
};
