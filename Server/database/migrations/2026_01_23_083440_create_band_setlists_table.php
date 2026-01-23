<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('band_setlists', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('band_id')->unique();

            $table->string('status', 20)
                  ->default('pending')
                  ->comment('pending | processing | ready | failed');

            $table->jsonb('payload')->nullable();

            $table->timestamp('generated_at')->nullable();

            $table->timestamps();

            $table->foreign('band_id')
                  ->references('id')
                  ->on('bands')
                  ->onDelete('cascade');
        });

        DB::statement("
            ALTER TABLE band_setlists
            ADD CONSTRAINT band_setlists_status_check
            CHECK (status IN ('pending', 'processing', 'ready', 'failed'))
        ");
    }

    public function down(): void
    {
        Schema::dropIfExists('band_setlists');
    }
};
