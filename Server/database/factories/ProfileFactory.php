<?php

namespace Database\Factories;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProfileFactory extends Factory
{
    protected $model = Profile::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'name' => $this->faker->name(),
            'username' => $this->faker->unique()->userName(),
            'bio' => $this->faker->sentence(),
            'location' => $this->faker->city(),
            'birth_date' => $this->faker->date(),
            'gender' => 'male', 
            'experience_level' => 'beginner',
            'embedding_dirty' => false,
        ];
    }
}
