<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('band_members', function (Blueprint $table) {
            $table->id();

            $table->foreignId('band_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('profile_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->timestamp('joined_at')->useCurrent();

            $table->unique(['band_id', 'profile_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('band_members');
    }
};
