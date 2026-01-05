<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_jams', function (Blueprint $table) {
            $table->id();

            $table->foreignId('profile_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('source_track_id')
                ->constrained('user_tracks')
                ->cascadeOnDelete();

            $table->string('key')->nullable();
            $table->integer('tempo_bpm')->nullable();
            $table->string('style')->nullable();
            $table->jsonb('chords')->nullable();

            $table->string('status')->default('pending');

            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('completed_at')->nullable();

            $table->index('profile_id');
            $table->index('source_track_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_jams');
    }
};
