<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('matches', function (Blueprint $table) {
            $table->id();

            $table->foreignId('profile_one_id')
                ->constrained('profiles')
                ->cascadeOnDelete();

            $table->foreignId('profile_two_id')
                ->constrained('profiles')
                ->cascadeOnDelete();

            $table->timestamp('created_at')->useCurrent();

            $table->unique(['profile_one_id', 'profile_two_id']);
            $table->index('profile_one_id');
            $table->index('profile_two_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('matches');
    }
};
