<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() !== 'pgsql') {
            return;
        }

        Schema::table('conversations', function (Blueprint $table) {
            $table->unsignedBigInteger('match_id')->nullable(false)->change();
        });
    }

    public function down(): void
    {
        if (DB::getDriverName() !== 'pgsql') {
            return;
        }

        Schema::table('conversations', function (Blueprint $table) {
            $table->unsignedBigInteger('match_id')->nullable()->change();
        });
    }
};
