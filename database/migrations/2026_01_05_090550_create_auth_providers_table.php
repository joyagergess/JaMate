<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('auth_providers', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('provider');

            $table->string('provider_user_id')->nullable();

            $table->timestamps();

            $table->unique(['provider', 'provider_user_id']);
            $table->index('user_id');
        });

        DB::statement("
            ALTER TABLE auth_providers
            ALTER COLUMN provider
            TYPE auth_provider_type
            USING provider::auth_provider_type
        ");
    }

    public function down(): void
    {
        Schema::dropIfExists('auth_providers');
    }
};
