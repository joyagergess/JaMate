<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('band_suggestion_members', function (Blueprint $table) {
            $table->id();

            $table->foreignId('band_suggestion_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('profile_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('decision'); 

            $table->timestamp('decided_at')->nullable();

            $table->unique(['band_suggestion_id', 'profile_id']);
            $table->index('profile_id');
        });

        DB::statement("
            ALTER TABLE band_suggestion_members
            ALTER COLUMN decision
            TYPE band_member_decision
            USING decision::band_member_decision
        ");

        DB::statement("
            ALTER TABLE band_suggestion_members
            ALTER COLUMN decision
            SET DEFAULT 'pending'
        ");
    }

    public function down(): void
    {
        Schema::dropIfExists('band_suggestion_members');
    }
};
