<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InstrumentSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('instruments')->insert([
            ['name' => 'Guitar'],
            ['name' => 'Piano'],
            ['name' => 'Drums'],
            ['name' => 'Bass'],
            ['name' => 'Vocals'],
            ['name' => 'Violin'],
            ['name' => 'Saxophone'],
        ]);
    }
}
