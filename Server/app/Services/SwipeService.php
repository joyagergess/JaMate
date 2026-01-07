<?php

namespace App\Services;

use App\Models\Swipe;
use App\Models\MatchModel;
use App\Models\Conversation;
use App\Models\ConversationParticipant;
use App\Models\Profile;
use Illuminate\Support\Facades\DB;

class SwipeService
{
    public function jam(Profile $me, Profile $other): array
    {
        return DB::transaction(function () use ($me, $other) {

            Swipe::updateOrCreate(
                [
                    'swiper_profile_id' => $me->id,
                    'swiped_profile_id' => $other->id,
                ],
                [
                    'direction' => 'jam',
                    'created_at' => now(),
                ]
            );

            $mutualJam = Swipe::where('swiper_profile_id', $other->id)
                ->where('swiped_profile_id', $me->id)
                ->where('direction', 'jam')
                ->exists();

            if (! $mutualJam) {
                return [
                    'status' => 'jammed',
                    'match'  => false,
                ];
            }

            $match = MatchModel::firstOrCreate([
                'profile_one_id' => min($me->id, $other->id),
                'profile_two_id' => max($me->id, $other->id),
            ], [
                'created_at' => now(),
            ]);

            $conversation = Conversation::create([
                'type' => 'direct',
                'created_by_profile_id' => $me->id,
                'created_at' => now(),
            ]);

            ConversationParticipant::insert([
                [
                    'conversation_id' => $conversation->id,
                    'profile_id' => $me->id,
                    'joined_at' => now(),
                ],
                [
                    'conversation_id' => $conversation->id,
                    'profile_id' => $other->id,
                    'joined_at' => now(),
                ],
            ]);

            return [
                'status' => 'jammed',
                'match'  => true,
                'conversation_id' => $conversation->id,
            ];
        });
    }
}
