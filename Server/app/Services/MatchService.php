<?php

namespace App\Services;

use App\Models\MatchModel;
use App\Models\Profile;
use Illuminate\Support\Collection;

class MatchService
{
    public function getMyMatches(Profile $me): Collection
    {
        $matches = $this->fetchMatchesForProfile($me);

        return $this->formatMatches($matches, $me);
    }

    protected function fetchMatchesForProfile(Profile $me): Collection
    {
        return MatchModel::query()
            ->where('profile_one_id', $me->id)
            ->orWhere('profile_two_id', $me->id)
            ->with([
                'conversation:id,match_id',
                'profileOne.media:id,profile_id,media_type,media_url,order_index',
                'profileTwo.media:id,profile_id,media_type,media_url,order_index',
            ])
            ->latest()
            ->get();
    }

    protected function formatMatches(Collection $matches, Profile $me): Collection
    {
        return $matches->map(function (MatchModel $match) use ($me) {

            $otherProfile =
                $match->profile_one_id === $me->id
                    ? $match->profileTwo
                    : $match->profileOne;

            return [
                'match_id' => $match->id,
                'conversation_id' => optional($match->conversation)->id,
                'matched_at' => $match->created_at,

                'profile' => [
                    'id' => $otherProfile->id,
                    'name' => $otherProfile->name,
                    'username' => $otherProfile->username,
                    'media' => $otherProfile->media->map(fn ($m) => [
                        'id' => $m->id,
                        'type' => $m->media_type,
                        'url' => $m->media_url,
                        'order' => $m->order_index,
                    ])->values(),
                ],
            ];
        });
    }
}
