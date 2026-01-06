<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ObjectiveSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('objectives')->insert([
            ['name' => 'Jam'],
            ['name' => 'Band'],
            ['name' => 'Recording'],
            ['name' => 'Collaboration'],
        ]);
    }
}
