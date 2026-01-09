<?php 
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("
            CREATE SEQUENCE IF NOT EXISTS profile_embeddings_id_seq
        ");

        DB::statement("
            ALTER TABLE profile_embeddings
            ALTER COLUMN id SET DEFAULT nextval('profile_embeddings_id_seq')
        ");

        DB::statement("
            SELECT setval(
                'profile_embeddings_id_seq',
                COALESCE((SELECT MAX(id) FROM profile_embeddings), 1),
                false
            )
        ");
    }

    public function down(): void
    {
        DB::statement("
            ALTER TABLE profile_embeddings
            ALTER COLUMN id DROP DEFAULT
        ");
    }
};
