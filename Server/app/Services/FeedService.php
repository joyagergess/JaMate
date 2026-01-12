<?php

namespace App\Services;

use App\Models\Profile;
use App\Models\Swipe;
use Illuminate\Support\Collection;

class FeedService
{
    protected const MAX_CANDIDATES = 50;
    protected const JAMMED_ME_BOOST = 20;

    public function __construct(
        protected SimilarityService $similarityService
    ) {}

    public function getFeed(Profile $me, int $limit = 20, bool $debug = false): array
    {
        $candidates = $this->candidatePool($me);

        if ($candidates->isEmpty()) {
            return [];
        }

        // Load my embedding once
        $myEmbedding = optional($me->embedding)->embedding;

        $myInstrumentIds = $me->instruments->pluck('id')->flip();
        $myGenreIds      = $me->genres->pluck('id')->flip();
        $myObjectiveIds  = $me->objectives->pluck('id')->flip();

        //  profiles that already jammed me 
        $jammedMeIds = Swipe::where('swiped_profile_id', $me->id)
            ->where('direction', 'jam')
            ->pluck('swiper_profile_id')
            ->flip();

        // Score each candidate (number of candidates is limited so it wouldn't crash )
        $scored = $candidates->map(function (Profile $candidate) use (
            $me,
            $myEmbedding,
            $myInstrumentIds,
            $myGenreIds,
            $myObjectiveIds,
            $jammedMeIds,
            $debug
        ) {
            // Score based on shared attributes
            $relationalScore = $this->relationalScore(
                $candidate,
                $myInstrumentIds,
                $myGenreIds,
                $myObjectiveIds,
                $me
            );

            // Semantic similarity using embeddings (i'm very proud of this)
            $similarityScore = null;
            if ($myEmbedding && $candidate->embedding) {
                $similarityScore = $this->similarityService->cosine(
                    $myEmbedding,
                    $candidate->embedding->embedding
                );
            }

            // Extra boost if the candidate already jammed me 
            $jammedBoost = isset($jammedMeIds[$candidate->id])
                ? self::JAMMED_ME_BOOST
                : 0;

            // Final weighted score
            $finalScore =
                ($relationalScore * 0.6) +
                (($similarityScore ?? 0) * 100 * 0.4) +
                $jammedBoost;

            $response = [
                'profile' => $this->transformProfile($candidate),
                'score'   => round($finalScore, 2),
            ];


            return $response;
        });

        // Sort and lightly shuffle similar scores
        return $this->softShuffle($scored, $limit);
    }

    protected function candidatePool(Profile $me): Collection
    {
        // Select profiles that aren't me , ready embedings,atleast have one media ,never swiped them,never matched before,never blocked 
        $candidateIds = Profile::query()
            ->where('id', '!=', $me->id)
            ->where('embedding_dirty', false)
            ->whereHas('media')
            ->whereNotExists(function ($q) use ($me) {
                $q->selectRaw(1)
                    ->from('swipes')
                    ->whereColumn('swipes.swiped_profile_id', 'profiles.id')
                    ->where('swipes.swiper_profile_id', $me->id);
            })
            ->whereNotExists(function ($q) use ($me) {
                $q->selectRaw(1)
                    ->from('matches')
                    ->where(function ($q) use ($me) {
                        $q->whereColumn('matches.profile_one_id', 'profiles.id')
                            ->where('matches.profile_two_id', $me->id);
                    })
                    ->orWhere(function ($q) use ($me) {
                        $q->whereColumn('matches.profile_two_id', 'profiles.id')
                            ->where('matches.profile_one_id', $me->id);
                    });
            })
            ->whereNotExists(function ($q) use ($me) {
                $q->selectRaw(1)
                    ->from('user_blocks')
                    ->whereColumn('user_blocks.blocked_profile_id', 'profiles.id')
                    ->where('user_blocks.blocker_profile_id', $me->id);
            })
            ->limit(self::MAX_CANDIDATES)
            ->pluck('id');

        return Profile::whereIn('id', $candidateIds)
            ->with([
                'instruments:id,name',
                'genres:id,name',
                'objectives:id,name',
                'embedding:profile_id,embedding',
                'media:id,profile_id,media_type,media_url,order_index',
            ])
            ->get();
    }

    protected function relationalScore(Profile $candidate, Collection $myInstrumentIds,   Collection $myGenreIds,  Collection $myObjectiveIds, Profile $me): int
    {
        $score = 0;

        // Shared instruments , genres, objective, experience,location
        if ($candidate->instruments->pluck('id')->some(fn($id) => isset($myInstrumentIds[$id]))) {
            $score += 30;
        }
        if ($candidate->genres->pluck('id')->some(fn($id) => isset($myGenreIds[$id]))) {
            $score += 20;
        }
        if ($candidate->objectives->pluck('id')->some(fn($id) => isset($myObjectiveIds[$id]))) {
            $score += 20;
        }
        if ($candidate->experience_level === $me->experience_level) {
            $score += 10;
        }
        if ($me->location && $candidate->location === $me->location) {
            $score += 10;
        }
        return $score;
    }

    protected function softShuffle(Collection $scored, int $limit): array
    {
        $sorted = $scored->sortByDesc('score')->values();

        $final = collect();
        $threshold = 3;

        // fetching randomly profiles with close scores
        while ($final->count() < $limit && $sorted->isNotEmpty()) {
            $topScore = $sorted->first()['score'];

            $close = $sorted->filter(
                fn($item) => abs($topScore - $item['score']) <= $threshold
            );

            $pick = $close->random();

            $final->push($pick);

            $sorted = $sorted->reject(
                fn($item) => $item['profile']['id'] === $pick['profile']['id']
            );
        }

        return $final->values()->all();
    }

    protected function transformProfile(Profile $profile): array
    {
        // Shaping profile data for API response
        return [
            'id' => $profile->id,
            'name' => $profile->name,
            'username' => $profile->username,
            'bio' => $profile->bio,
            'location' => $profile->location,
            'gender' => $profile->gender,
            'experience_level' => $profile->experience_level,

            'instruments' => $profile->instruments,

            'genres' => $profile->genres,

            'objectives' => $profile->objectives,

            'media' => $profile->media->map(fn($m) => [
                'id' => $m->id,
                'type' => $m->media_type,
                'url' => $m->media_url,
                'order' => $m->order_index,
            ])->values(),
        ];
    }
}
