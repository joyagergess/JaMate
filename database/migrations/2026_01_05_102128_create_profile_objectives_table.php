<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('profile_objectives', function (Blueprint $table) {
            $table->foreignId('profile_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('objective_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->unique(['profile_id', 'objective_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('profile_objectives');
    }
};
