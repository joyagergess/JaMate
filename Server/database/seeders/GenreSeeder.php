<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GenreSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('genres')->insert([
            ['name' => 'Rock'],
            ['name' => 'Blues'],
            ['name' => 'Jazz'],
            ['name' => 'Pop'],
            ['name' => 'Metal'],
            ['name' => 'Classical'],
            ['name' => 'Hip Hop'],
            ['name' => 'Electronic'],
        ]);
    }
}
