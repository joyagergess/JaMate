<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('DROP TYPE IF EXISTS band_suggestion_status CASCADE');

        DB::statement("
            CREATE TYPE band_suggestion_status AS ENUM (
                'pending',
                'accepted',
                'rejected',
                'expired'
            )
        ");
    }

    public function down(): void
    {
        DB::statement('DROP TYPE IF EXISTS band_suggestion_status CASCADE');
    }
};
