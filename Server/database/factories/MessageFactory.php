<?php

namespace Database\Factories;

use App\Models\Message;
use App\Models\Conversation;
use App\Models\Profile;
use Illuminate\Database\Eloquent\Factories\Factory;

class MessageFactory extends Factory
{
    protected $model = Message::class;

    public function definition(): array
    {
        return [
            'conversation_id' => Conversation::factory(),
            'sender_profile_id' => Profile::factory(),
            'body' => $this->faker->sentence(),
            'sent_at' => now(),
        ];
    }
}
