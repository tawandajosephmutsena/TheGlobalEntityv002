<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('podcast_categories', function (Blueprint $table) {
            $table->string('artwork')->nullable()->after('icon');
            $table->string('author')->nullable()->after('artwork');
            $table->string('owner_name')->nullable()->after('author');
            $table->string('owner_email')->nullable()->after('owner_name');
            $table->string('itunes_category')->nullable()->after('owner_email');
            $table->boolean('itunes_explicit')->default(false)->after('itunes_category');
            $table->string('itunes_type')->default('episodic')->after('itunes_explicit');
            $table->string('language', 10)->default('en')->after('itunes_type');
        });
    }

    public function down(): void
    {
        Schema::table('podcast_categories', function (Blueprint $table) {
            $table->dropColumn([
                'artwork',
                'author',
                'owner_name',
                'owner_email',
                'itunes_category',
                'itunes_explicit',
                'itunes_type',
                'language',
            ]);
        });
    }
};
