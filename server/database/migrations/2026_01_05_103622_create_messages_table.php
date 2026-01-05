<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id();

            $table->foreignId('conversation_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('sender_profile_id')
                ->constrained('profiles')
                ->cascadeOnDelete();

            $table->string('type');

            $table->text('body')->nullable();
            $table->string('voice_url')->nullable();

            $table->foreignId('track_id')
                ->nullable()
                ->constrained('user_tracks')
                ->nullOnDelete();

            $table->timestamp('sent_at')->useCurrent();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['conversation_id', 'sent_at']);
            $table->index('sender_profile_id');
        });

        DB::statement("
            ALTER TABLE messages
            ALTER COLUMN type
            TYPE message_type
            USING type::message_type
        ");
    }

    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
