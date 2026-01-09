<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('band_suggestions', function (Blueprint $table) {
            $table->timestamp('expires_at')->nullable()->after('status');
            $table->integer('ai_score')->nullable()->after('expires_at');
            $table->text('ai_reason')->nullable()->after('ai_score');
        });
    }

    public function down(): void
    {
        Schema::table('band_suggestions', function (Blueprint $table) {
            $table->dropColumn([
                'expires_at',
                'ai_score',
                'ai_reason',
            ]);
        });
    }
};
