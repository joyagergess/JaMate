<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('profile_media', function (Blueprint $table) {
            $table->id();

            $table->foreignId('profile_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('media_type');
            $table->string('media_url');
            $table->integer('order_index')->default(0);

            $table->timestamp('created_at')->useCurrent();

            $table->index(['profile_id', 'order_index']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('profile_media');
    }
};
