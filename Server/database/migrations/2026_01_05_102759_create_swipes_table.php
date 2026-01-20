<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('swipes', function (Blueprint $table) {
            $table->id();

            $table->foreignId('swiper_profile_id')
                ->constrained('profiles')
                ->cascadeOnDelete();

            $table->foreignId('swiped_profile_id')
                ->constrained('profiles')
                ->cascadeOnDelete();

            $table->string('direction');

            $table->timestamp('created_at')->useCurrent();

            $table->unique(['swiper_profile_id', 'swiped_profile_id']);
            $table->index(['swiper_profile_id', 'created_at']);
            $table->index(['swiped_profile_id', 'direction']);
        });

        if (DB::getDriverName() === 'pgsql') {
            DB::statement("
                ALTER TABLE swipes
                ALTER COLUMN direction
                TYPE swipe_direction
                USING direction::swipe_direction
            ");
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('swipes');
    }
};
