<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('band_suggestion_members', function (Blueprint $table) {

            $table->index(
                'profile_id',
                'idx_bsm_profile_id'
            );

            $table->index(
                'band_suggestion_id',
                'idx_bsm_suggestion_id'
            );

            $table->index(
                ['profile_id', 'band_suggestion_id'],
                'idx_bsm_profile_suggestion'
            );
        });
    }

    public function down(): void
    {
        Schema::table('band_suggestion_members', function (Blueprint $table) {
            $table->dropIndex('idx_bsm_profile_id');
            $table->dropIndex('idx_bsm_suggestion_id');
            $table->dropIndex('idx_bsm_profile_suggestion');
        });
    }
};
