<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('DROP TYPE IF EXISTS experience_level CASCADE');

        DB::statement("
            CREATE TYPE experience_level AS ENUM (
                'beginner',
                'intermediate',
                'advanced',
                'pro'
            )
        ");
    }

    public function down(): void
    {
        DB::statement('DROP TYPE IF EXISTS experience_level CASCADE');
    }
};
