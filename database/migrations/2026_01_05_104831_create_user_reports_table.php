<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_reports', function (Blueprint $table) {
            $table->id();

            $table->foreignId('reporter_profile_id')
                ->constrained('profiles')
                ->cascadeOnDelete();

            $table->foreignId('reported_profile_id')
                ->constrained('profiles')
                ->cascadeOnDelete();

            $table->string('reason');
            $table->text('description')->nullable();

            $table->timestamp('created_at')->useCurrent();

            $table->index('reported_profile_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_reports');
    }
};
