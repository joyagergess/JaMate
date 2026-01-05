<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('DROP TYPE IF EXISTS swipe_direction CASCADE');

        DB::statement("
            CREATE TYPE swipe_direction AS ENUM (
                'jam',
                'skip'
            )
        ");
    }

    public function down(): void
    {
        DB::statement('DROP TYPE IF EXISTS swipe_direction CASCADE');
    }
};
