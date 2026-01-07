<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            InstrumentSeeder::class,
            GenreSeeder::class,
            ObjectiveSeeder::class,
            ProfileSeeder::class,
        ]);
    }
}
