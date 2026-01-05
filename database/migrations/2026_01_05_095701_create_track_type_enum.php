<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('DROP TYPE IF EXISTS track_type CASCADE');

        DB::statement("
            CREATE TYPE track_type AS ENUM (
                'recording',
                'snippet',
                'ai_generated'
            )
        ");
    }

    public function down(): void
    {
        DB::statement('DROP TYPE IF EXISTS track_type CASCADE');
    }
};
