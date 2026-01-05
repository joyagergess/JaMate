<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_backing_tracks', function (Blueprint $table) {
            $table->id();

            $table->foreignId('ai_jam_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('variation')->nullable();
            $table->string('audio_url');
            $table->integer('duration')->nullable();

            $table->timestamp('created_at')->useCurrent();

            $table->index('ai_jam_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_backing_tracks');
    }
};
