<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('band_suggestions', function (Blueprint $table) {
            $table->id();

            if (DB::getDriverName() === 'pgsql') {
                $table->jsonb('profile_ids');
            } else {
                $table->json('profile_ids');
            }

            $table->string('status')->default('pending');

            $table->timestamp('created_at')->useCurrent();
        });

        if (DB::getDriverName() === 'pgsql') {
            DB::statement("
                ALTER TABLE band_suggestions
                ALTER COLUMN status
                TYPE band_suggestion_status
                USING status::band_suggestion_status
            ");

            DB::statement("
                ALTER TABLE band_suggestions
                ALTER COLUMN status
                SET DEFAULT 'pending'
            ");
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('band_suggestions');
    }
};
