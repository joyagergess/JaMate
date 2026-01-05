<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('DROP TYPE IF EXISTS notification_type CASCADE');

        DB::statement("
            CREATE TYPE notification_type AS ENUM (
                'match',
                'message',
                'ai_match'
            )
        ");
    }

    public function down(): void
    {
        DB::statement('DROP TYPE IF EXISTS notification_type CASCADE');
    }
};
