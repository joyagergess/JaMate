<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('DROP TYPE IF EXISTS band_member_decision CASCADE');

        DB::statement("
            CREATE TYPE band_member_decision AS ENUM (
                'pending',
                'jam',
                'decline'
            )
        ");
    }

    public function down(): void
    {
        DB::statement('DROP TYPE IF EXISTS band_member_decision CASCADE');
    }
};
