<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shared_tracks', function (Blueprint $table) {
            $table->id();

            $table->foreignId('sender_profile_id')
                ->constrained('profiles')
                ->cascadeOnDelete();

            $table->foreignId('receiver_profile_id')
                ->constrained('profiles')
                ->cascadeOnDelete();

            $table->foreignId('track_id')
                ->constrained('user_tracks')
                ->cascadeOnDelete();

            $table->string('context')->nullable();

            $table->timestamp('created_at')->useCurrent();

            $table->index('sender_profile_id');
            $table->index('receiver_profile_id');
            $table->index('track_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shared_tracks');
    }
};
