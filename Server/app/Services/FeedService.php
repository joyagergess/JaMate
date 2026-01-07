<?php

namespace App\Services;

use App\Models\Profile;
use Illuminate\Support\Collection;

class FeedService
{
    public function __construct(
        protected SimilarityService $similarityService
    ) {}


    public function getFeed(Profile $me, int $limit = 20, bool $debug = false): array
    {
        $candidates = $this->candidatePool($me, $limit);

        if ($candidates->isEmpty()) {
            return [];
        }

        $myEmbedding = optional($me->embedding)->embedding;

        $scored = $candidates->map(function (Profile $candidate) use ($me, $myEmbedding, $debug) {

            $relationalScore = $this->relationalScore($me, $candidate);

            $similarityScore = null;
            if ($myEmbedding && $candidate->embedding) {
                $similarityScore = $this->similarityService->cosine(
                    $myEmbedding,
                    $candidate->embedding->embedding
                );
            }

            $jammedMeBoost = $this->jammedMe($me, $candidate) ? 15 : 0;

            $finalScore =
                ($relationalScore * 0.6) +
                (($similarityScore ?? 0) * 100 * 0.4) +
                $jammedMeBoost;

            $response = [
                'profile' => $this->transformProfile($candidate),
                'score'   => round($finalScore, 2),
            ];

            if ($debug) {
                $response['debug'] = [
                    'relational' => $relationalScore,
                    'similarity' => $similarityScore !== null
                        ? round($similarityScore, 4)
                        : null,
                    'jammed_me'  => $jammedMeBoost > 0,
                    'weights' => [
                        'relational' => 0.6,
                        'similarity' => 0.4,
                        'jammed_me_boost' => 15,
                    ],
                ];
            }

            return $response;
        });

        $sorted = $scored->sortByDesc('score')->values();

        $finalFeed = collect();
        $threshold = 3;

        while ($finalFeed->count() < $limit && $sorted->isNotEmpty()) {
            $topScore = $sorted->first()['score'];

            $close = $sorted->filter(
                fn($item) =>
                abs($topScore - $item['score']) <= $threshold
            );

            $pick = $close->random();

            $finalFeed->push($pick);
            $sorted = $sorted->reject(
                fn($item) => $item['profile']['id'] === $pick['profile']['id']
            );
        }

        return $finalFeed->values()->all();
    }


    protected function candidatePool(Profile $me): Collection
    {
        return Profile::query()
            ->where('id', '!=', $me->id)

            ->whereNotIn('id', function ($q) use ($me) {
                $q->select('swiped_profile_id')
                    ->from('swipes')
                    ->where('swiper_profile_id', $me->id);
            })

            ->whereNotIn('id', function ($q) use ($me) {
                $q->select('profile_one_id')
                    ->from('matches')
                    ->where('profile_two_id', $me->id);
            })
            ->whereNotIn('id', function ($q) use ($me) {
                $q->select('profile_two_id')
                    ->from('matches')
                    ->where('profile_one_id', $me->id);
            })

            ->whereNotIn('id', function ($q) use ($me) {
                $q->select('blocked_profile_id')
                    ->from('user_blocks')
                    ->where('blocker_profile_id', $me->id);
            })

            ->whereHas('media')

            ->with([
                'instruments:id,name',
                'genres:id,name',
                'objectives:id,name',
                'media',
                'embedding',
            ])

            ->limit(50)
            ->get();
    }


    protected function relationalScore(Profile $me, Profile $other): int
    {
        $score = 0;

        if ($me->instruments->pluck('id')->intersect($other->instruments->pluck('id'))->isNotEmpty()) {
            $score += 30;
        }

        if ($me->genres->pluck('id')->intersect($other->genres->pluck('id'))->isNotEmpty()) {
            $score += 20;
        }

        if ($me->objectives->pluck('id')->intersect($other->objectives->pluck('id'))->isNotEmpty()) {
            $score += 20;
        }

        if ($me->experience_level === $other->experience_level) {
            $score += 10;
        }

        if ($me->location && $me->location === $other->location) {
            $score += 10;
        }

        return $score;
    }

    protected function jammedMe(Profile $me, Profile $candidate): bool
    {
        return $candidate->swipesSent()
            ->where('swiped_profile_id', $me->id)
            ->where('direction', 'jam')
            ->exists();
    }



    protected function transformProfile(Profile $profile): array
    {
        return [
            'id' => $profile->id,
            'name' => $profile->name,
            'username' => $profile->username,
            'bio' => $profile->bio,
            'location' => $profile->location,
            'gender' => $profile->gender,
            'experience_level' => $profile->experience_level,

            'instruments' => $profile->instruments->map(fn($i) => [
                'id' => $i->id,
                'name' => $i->name,
            ])->values(),

            'genres' => $profile->genres->map(fn($g) => [
                'id' => $g->id,
                'name' => $g->name,
            ])->values(),

            'objectives' => $profile->objectives->map(fn($o) => [
                'id' => $o->id,
                'name' => $o->name,
            ])->values(),

            'media' => $profile->media->map(fn($m) => [
                'id' => $m->id,
                'type' => $m->media_type,
                'url' => $m->media_url,
                'order' => $m->order_index,
            ])->values(),
        ];
    }
}
