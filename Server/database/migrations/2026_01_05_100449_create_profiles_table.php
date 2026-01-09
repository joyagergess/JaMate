<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->unique()
                ->constrained()
                ->cascadeOnDelete();

            $table->string('name');

            $table->string('username')
                ->nullable()
                ->unique();

            $table->text('bio')->nullable();

            $table->string('location')->nullable();

            $table->date('birth_date')->nullable();

            $table->string('gender');
            $table->string('experience_level');

            $table->timestamps();
        });

        DB::statement("
            ALTER TABLE profiles
            ALTER COLUMN gender
            TYPE gender
            USING gender::gender
        ");

        DB::statement("
            ALTER TABLE profiles
            ALTER COLUMN experience_level
            TYPE experience_level
            USING experience_level::experience_level
        ");
    }

    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
