<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('DROP TYPE IF EXISTS request_status CASCADE');

        DB::statement("
            CREATE TYPE request_status AS ENUM (
                'pending',
                'accepted',
                'rejected',
                'cancelled'
            )
        ");
    }

    public function down(): void
    {
        DB::statement('DROP TYPE IF EXISTS request_status CASCADE');
    }
};
