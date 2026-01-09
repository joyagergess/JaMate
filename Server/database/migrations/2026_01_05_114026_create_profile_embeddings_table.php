<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('profile_embeddings', function (Blueprint $table) {

            $table->unsignedBigInteger('profile_id')->primary();

            $table->json('embedding');

            $table->timestamp('updated_at')->useCurrent();
            $table->foreign('profile_id')
                ->references('id')
                ->on('profiles')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('profile_embeddings');
    }
};
