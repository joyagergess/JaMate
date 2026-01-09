<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('band_suggestions', function (Blueprint $table) {
            $table->index(
                ['status', 'expires_at'],
                'idx_band_suggestions_status_expires'
            );
        });
    }

    public function down(): void
    {
        Schema::table('band_suggestions', function (Blueprint $table) {
            $table->dropIndex('idx_band_suggestions_status_expires');
        });
    }
};
