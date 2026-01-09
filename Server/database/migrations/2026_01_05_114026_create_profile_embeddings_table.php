<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('profile_embeddings', function (Blueprint $table) {
            $table->foreignId('profile_id')
                ->primary()
                ->constrained('profiles')
                ->cascadeOnDelete();

            $table->float('embedding')->array();

            $table->timestamp('updated_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('profile_embeddings');
    }
};
