<?php 
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('profile_embeddings', function (Blueprint $table) {
            $table->bigInteger('id')->nullable()->first();
        });

        DB::statement('
            UPDATE profile_embeddings
            SET id = nextval(pg_get_serial_sequence(\'profile_embeddings\', \'profile_id\'))
        ');

        Schema::table('profile_embeddings', function (Blueprint $table) {
            $table->bigInteger('id')->nullable(false)->change();
        });

        Schema::table('profile_embeddings', function (Blueprint $table) {
            $table->dropPrimary(['profile_id']);
        });

        Schema::table('profile_embeddings', function (Blueprint $table) {
            $table->primary('id');
            $table->unique('profile_id');
        });
    }

    public function down(): void
    {
        Schema::table('profile_embeddings', function (Blueprint $table) {
            $table->dropPrimary(['id']);
            $table->dropUnique(['profile_id']);
            $table->dropColumn('id');
            $table->primary('profile_id');
        });
    }
};
