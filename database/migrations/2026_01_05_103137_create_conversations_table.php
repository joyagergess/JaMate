<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('conversations', function (Blueprint $table) {
            $table->id();

            $table->string('type');

            $table->string('name')->nullable();

            $table->foreignId('created_by_profile_id')
                ->constrained('profiles')
                ->cascadeOnDelete();

            $table->timestamp('created_at')->useCurrent();
        });

        DB::statement("
            ALTER TABLE conversations
            ALTER COLUMN type
            TYPE conversation_type
            USING type::conversation_type
        ");
    }

    public function down(): void
    {
        Schema::dropIfExists('conversations');
    }
};
