<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() === 'pgsql') {
            DB::statement('DROP TYPE IF EXISTS auth_provider_type CASCADE');

            DB::statement("
                CREATE TYPE auth_provider_type AS ENUM (
                    'email',
                    'google'
                )
            ");
        }
    }

    public function down(): void
    {
        if (DB::getDriverName() === 'pgsql') {
            DB::statement('DROP TYPE IF EXISTS auth_provider_type CASCADE');
        }
    }
};
