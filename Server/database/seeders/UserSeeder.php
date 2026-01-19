<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        for ($i = 1; $i <= 50; $i++) {
            User::create([
                'email' => "user{$i}@test.com",
                'password' => Hash::make('password123'),
                'email_verified_at' => Carbon::now(),
            ]);
        }
    }
}
