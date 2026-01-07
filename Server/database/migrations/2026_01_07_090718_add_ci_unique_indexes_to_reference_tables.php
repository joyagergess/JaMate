<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement(
            'CREATE UNIQUE INDEX IF NOT EXISTS instruments_name_ci_unique
             ON instruments (LOWER(name))'
        );

        DB::statement(
            'CREATE UNIQUE INDEX IF NOT EXISTS genres_name_ci_unique
             ON genres (LOWER(name))'
        );

        DB::statement(
            'CREATE UNIQUE INDEX IF NOT EXISTS objectives_name_ci_unique
             ON objectives (LOWER(name))'
        );
    }

    public function down(): void
    {
        DB::statement('DROP INDEX IF EXISTS instruments_name_ci_unique');
        DB::statement('DROP INDEX IF EXISTS genres_name_ci_unique');
        DB::statement('DROP INDEX IF EXISTS objectives_name_ci_unique');
    }
};
