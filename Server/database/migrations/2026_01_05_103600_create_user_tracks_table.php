<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_tracks', function (Blueprint $table) {
            $table->id();

            $table->foreignId('profile_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('title');
            $table->string('audio_url');
            $table->integer('duration')->nullable();

            $table->string('track_type');
            $table->string('visibility');

            $table->string('source')->nullable();

            $table->timestamps();

            $table->index(['profile_id', 'created_at']);
            $table->index('track_type');
            $table->index('visibility');
        });

        if (DB::getDriverName() === 'pgsql') {
            DB::statement("
                ALTER TABLE user_tracks
                ALTER COLUMN track_type
                TYPE track_type
                USING track_type::track_type
            ");

            DB::statement("
                ALTER TABLE user_tracks
                ALTER COLUMN visibility
                TYPE track_visibility
                USING visibility::track_visibility
            ");
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('user_tracks');
    }
};
