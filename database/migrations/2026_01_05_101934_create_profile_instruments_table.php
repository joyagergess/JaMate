<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('profile_instruments', function (Blueprint $table) {
            $table->foreignId('profile_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('instrument_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->unique(['profile_id', 'instrument_id']);
            $table->index('instrument_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('profile_instruments');
    }
};
