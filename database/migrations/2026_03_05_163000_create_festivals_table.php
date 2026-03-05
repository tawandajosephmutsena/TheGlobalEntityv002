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
        Schema::create('festivals', function (Blueprint $group) {
            $group->id();
            $group->string('name');
            $group->string('slug')->unique();
            $group->json('location')->nullable();
            $group->dateTime('start_date')->nullable();
            $group->dateTime('end_date')->nullable();
            $group->json('social_tags')->nullable();
            $group->boolean('is_published')->default(false);
            $group->foreignId('author_id')->constrained('users')->onDelete('cascade');
            $group->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('festivals');
    }
};
