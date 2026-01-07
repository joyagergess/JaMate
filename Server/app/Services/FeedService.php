<?php

namespace App\Services;

use App\Models\Profile;
use Illuminate\Support\Collection;

class FeedService
{
    public function __construct(
        protected SimilarityService $similarityService
    ) {}

    
    public function next(Profile $me): ?Profile
    {
        $candidates = $this->candidatePool($me);

        if ($candidates->isEmpty()) {
            return null;
        }

        $myEmbedding = optional($me->embedding)->embedding;

        $scored = $candidates->map(function (Profile $candidate) use ($me, $myEmbedding) {
            $relational = $this->relationalScore($me, $candidate);
            $embeddingScore = 0;

            if ($myEmbedding && $candidate->embedding) {
                $cosine = $this->similarityService->cosine(
                    $myEmbedding,
                    $candidate->embedding->embedding
                );

                $embeddingScore = $this->similarityService->normalize($cosine);
            }

            return [
                'profile' => $candidate,
                'score' => ($relational * 0.6) + ($embeddingScore * 0.4),
            ];
        });

        return $scored
            ->sortByDesc('score')
            ->first()['profile'];
    }

   
    protected function candidatePool(Profile $me): Collection
    {
        return Profile::query()
            ->where('id', '!=', $me->id)

            ->whereNotIn('id', function ($q) use ($me) {
                $q->select('to_profile_id')
                  ->from('swipes')
                  ->where('from_profile_id', $me->id);
            })

            ->whereHas('media')

            ->with([
                'instruments:id,name',
                'genres:id,name',
                'objectives:id,name',
                'embedding',
            ])

            ->limit(40) 
            ->get();
    }

    protected function relationalScore(Profile $me, Profile $other): int
    {
        $score = 0;

        $sharedInstruments = $me->instruments
            ->pluck('id')
            ->intersect($other->instruments->pluck('id'))
            ->count();

        if ($sharedInstruments > 0) {
            $score += 30;
        }

        $sharedGenres = $me->genres
            ->pluck('id')
            ->intersect($other->genres->pluck('id'))
            ->count();

        if ($sharedGenres > 0) {
            $score += 20;
        }

        $sharedObjectives = $me->objectives
            ->pluck('id')
            ->intersect($other->objectives->pluck('id'))
            ->count();

        if ($sharedObjectives > 0) {
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
}
