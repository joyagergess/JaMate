<?php

namespace App\Services;

use App\Models\Swipe;
use App\Models\MatchModel;
use App\Models\Conversation;
use App\Models\ConversationParticipant;
use App\Models\Profile;
use Illuminate\Support\Facades\DB;
use LogicException;
use InvalidArgumentException;

class SwipeService
{

    public function swipe(Profile $me, Profile $other, string $direction): array
    {
        if ($me->id === $other->id) {
            throw new LogicException('Cannot swipe yourself');
        }

        if (! in_array($direction, ['jam', 'skip'], true)) {
            throw new InvalidArgumentException('Invalid swipe direction');
        }

        return DB::transaction(function () use ($me, $other, $direction) {

            $this->recordSwipe($me, $other, $direction);

            if ($direction !== 'jam') {
                return $this->swipeResponse(false);
            }

            if (! $this->hasMutualJam($me, $other)) {
                return $this->swipeResponse(false);
            }

            $match = $this->getOrCreateMatch($me, $other);

            $conversation = $this->getOrCreateConversation(
                $match->id,
                $me->id
            );

            $this->attachParticipants(
                $conversation->id,
                $me->id,
                $other->id
            );

            return $this->swipeResponse(true, $conversation->id);
        });
    }


    protected function recordSwipe(Profile $me, Profile $other, string $direction): void
    {
        Swipe::updateOrCreate(
            [
                'swiper_profile_id' => $me->id,
                'swiped_profile_id' => $other->id,
            ],
            [
                'direction' => $direction,
            ]
        );
    }

    protected function hasMutualJam(Profile $me, Profile $other): bool
    {
        return Swipe::where('swiper_profile_id', $other->id)
            ->where('swiped_profile_id', $me->id)
            ->where('direction', 'jam')
            ->exists();
    }

    protected function getOrCreateMatch(Profile $me, Profile $other): MatchModel
    {
        return MatchModel::firstOrCreate([
            'profile_one_id' => min($me->id, $other->id),
            'profile_two_id' => max($me->id, $other->id),
        ]);
    }

    protected function getOrCreateConversation(int $matchId): Conversation
    {
        return Conversation::firstOrCreate(
            ['match_id' => $matchId],
            ['type' => 'direct']
        );
    }


    protected function attachParticipants(int $conversationId, int $profileA, int $profileB): void
    {
        ConversationParticipant::insertOrIgnore([
            [
                'conversation_id' => $conversationId,
                'profile_id' => $profileA,
            ],
            [
                'conversation_id' => $conversationId,
                'profile_id' => $profileB,
            ],
        ]);
    }

    protected function swipeResponse(bool $matched, ?int $conversationId = null): array
    {
        return [
            'matched' => $matched,
            'conversation_id' => $conversationId,
        ];
    }
}
