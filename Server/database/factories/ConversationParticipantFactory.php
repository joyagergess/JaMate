<?php

namespace Database\Factories;

use App\Models\ConversationParticipant;
use App\Models\Conversation;
use App\Models\Profile;
use Illuminate\Database\Eloquent\Factories\Factory;

class ConversationParticipantFactory extends Factory
{
    protected $model = ConversationParticipant::class;

    public function definition(): array
    {
        return [
            'conversation_id' => Conversation::factory(),
            'profile_id' => Profile::factory(),
            'last_read_at' => now()->subHour(),
        ];
    }
}
