<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('jam_requests', function (Blueprint $table) {
            $table->id();

            $table->foreignId('sender_profile_id')
                ->constrained('profiles')
                ->cascadeOnDelete();

            $table->foreignId('receiver_profile_id')
                ->constrained('profiles')
                ->cascadeOnDelete();

            $table->text('message')->nullable();

            $table->string('status');

            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('responded_at')->nullable();

            $table->unique(['sender_profile_id', 'receiver_profile_id']);
            $table->index(['receiver_profile_id', 'status']);
        });

        DB::statement("
            ALTER TABLE jam_requests
            ALTER COLUMN status
            TYPE request_status
            USING status::request_status
        ");
    }

    public function down(): void
    {
        Schema::dropIfExists('jam_requests');
    }
};
