<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('DROP TYPE IF EXISTS gender CASCADE');

        DB::statement("
            CREATE TYPE gender AS ENUM (
                'male',
                'female',
            )
        ");
    }

    public function down(): void
    {
        DB::statement('DROP TYPE IF EXISTS gender CASCADE');
    }
};
