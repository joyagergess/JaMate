<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_backing_jobs', function (Blueprint $table) {
            $table->id();

            $table->foreignId('source_track_id')
                ->constrained('user_tracks')
                ->cascadeOnDelete();

            $table->foreignId('output_track_id')
                ->nullable()
                ->constrained('user_tracks')
                ->nullOnDelete();

            $table->string('status', 20)->default('queued');

            $table->unsignedInteger('bpm')->nullable();
            $table->string('musical_key', 10)->nullable();
            $table->jsonb('chords')->nullable();
            $table->string('genre', 50)->nullable();

            $table->text('error')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_backing_jobs');
    }
};
