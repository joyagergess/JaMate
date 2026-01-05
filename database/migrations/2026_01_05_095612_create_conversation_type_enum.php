<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('DROP TYPE IF EXISTS conversation_type CASCADE');

        DB::statement("
            CREATE TYPE conversation_type AS ENUM (
                'direct',
                'group'
            )
        ");
    }

    public function down(): void
    {
        DB::statement('DROP TYPE IF EXISTS conversation_type CASCADE');
    }
};
