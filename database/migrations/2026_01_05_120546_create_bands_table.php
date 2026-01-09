<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bands', function (Blueprint $table) {
            $table->id();

            $table->foreignId('band_suggestion_id')
                ->nullable()
                ->constrained('band_suggestions')
                ->nullOnDelete();

            $table->foreignId('conversation_id')
                ->nullable()
                ->constrained('conversations')
                ->nullOnDelete();

            $table->string('cover_image_url')->nullable();

            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bands');
    }
};
