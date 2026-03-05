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
        Schema::create('reviews', function (Blueprint $group) {
            $group->id();
            $group->foreignId('user_id')->constrained()->onDelete('cascade');
            $group->morphs('reviewable');
            $group->integer('vibe_rating')->default(5);
            $group->integer('safety_rating')->default(5);
            $group->integer('sustainability_rating')->default(5);
            $group->text('body')->nullable();
            $group->string('status')->default('pending'); // pending, approved, rejected
            $group->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
