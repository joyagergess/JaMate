<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('DROP TYPE IF EXISTS message_type CASCADE');

        DB::statement("
            CREATE TYPE message_type AS ENUM (
                'text',
                'voice',
                'track'
            )
        ");
    }

    public function down(): void
    {
        DB::statement('DROP TYPE IF EXISTS message_type CASCADE');
    }
};
