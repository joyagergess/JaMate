<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();

            $table->foreignId('profile_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('type');

            $table->jsonb('data')->nullable();
            $table->boolean('is_read')->default(false);

            $table->timestamp('created_at')->useCurrent();

            $table->index(['profile_id', 'is_read']);
        });

        DB::statement("
            ALTER TABLE notifications
            ALTER COLUMN type
            TYPE notification_type
            USING type::notification_type
        ");
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
