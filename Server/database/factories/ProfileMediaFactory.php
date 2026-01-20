<?php

namespace Database\Factories;

use App\Models\ProfileMedia;
use App\Models\Profile;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProfileMediaFactory extends Factory
{
    protected $model = ProfileMedia::class;

    public function definition(): array
    {
        return [
            'profile_id'    => Profile::factory(),
            'media_type'    => 'image', 
            'thumbnail_url' => $this->faker->imageUrl(300, 300),
            'media_url'     => $this->faker->uuid . '.jpg',
            'order_index'   => 1, 
        ];
    }

    public function video(): self
    {
        return $this->state(fn () => [
            'media_type' => 'video',
            'media_url'  => $this->faker->uuid . '.mp4',
        ]);
    }

    public function primary(): self
    {
        return $this->state(fn () => [
            'order_index' => 1,
        ]);
    }
}
