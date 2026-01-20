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
            Schema::table('conversations', function (Blueprint $table) {
                $table->unsignedBigInteger('match_id')->nullable();
            });

            return;
        }

        Schema::table('conversations', function (Blueprint $table) {
            $table->foreignId('match_id')
                ->nullable()
                ->unique()
                ->constrained('matches')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        if (DB::getDriverName() !== 'pgsql') {
            Schema::table('conversations', function (Blueprint $table) {
                $table->dropColumn('match_id');
            });

            return;
        }

        Schema::table('conversations', function (Blueprint $table) {
            $table->dropConstrainedForeignId('match_id');
        });
    }
};
