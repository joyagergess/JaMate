<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('DROP TYPE IF EXISTS track_visibility CASCADE');

        DB::statement("
            CREATE TYPE track_visibility AS ENUM (
                'public',
                'private'
            )
        ");
    }

    public function down(): void
    {
        DB::statement('DROP TYPE IF EXISTS track_visibility CASCADE');
    }
};
