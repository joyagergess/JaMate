<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() === 'pgsql') {
            DB::statement('DROP TYPE IF EXISTS swipe_direction CASCADE');

            DB::statement("
                CREATE TYPE swipe_direction AS ENUM (
                    'jam',
                    'skip'
                )
            ");
        }
    }

    public function down(): void
    {
        if (DB::getDriverName() === 'pgsql') {
            DB::statement('DROP TYPE IF EXISTS swipe_direction CASCADE');
        }
    }
};
