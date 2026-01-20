<?php

namespace Database\Factories;

use App\Models\Swipe;
use App\Models\Profile;
use Illuminate\Database\Eloquent\Factories\Factory;

class SwipeFactory extends Factory
{
    protected $model = Swipe::class;

    public function definition(): array
    {
        return [
            'swiper_profile_id' => Profile::factory(),
            'swiped_profile_id' => Profile::factory(),
            'direction'         => 'jam',
            'created_at'        => now(),
        ];
    }

    
    public function skip(): self
    {
        return $this->state(fn () => [
            'direction' => 'skip',
            'created_at' => now(),
        ]);
    }

   
    public function oldSkip(): self
    {
        return $this->state(fn () => [
            'direction'  => 'skip',
            'created_at' => now()->subDays(10),
        ]);
    }
}
