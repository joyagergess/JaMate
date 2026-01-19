<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ai_backing_tracks', function (Blueprint $table) {
            $table->foreignId('profile_id')
                ->after('ai_jam_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->index('profile_id');
        });
    }

    public function down(): void
    {
        Schema::table('ai_backing_tracks', function (Blueprint $table) {
            $table->dropForeign(['profile_id']);
            $table->dropIndex(['profile_id']);
            $table->dropColumn('profile_id');
        });
    }
};
