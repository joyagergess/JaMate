<?php

namespace App\Services;

use App\Models\Profile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class BandFormationService
{

    public function getEligibleProfiles(?int $profileId = null): Collection
    {
        return Profile::query()
            ->when($profileId, fn ($q) =>
                $q->where('id', $profileId)
            )
            ->whereHas('embedding')
            ->whereDoesntHave('bandMembers')
            ->whereHas('media')
            ->get();
    }

    

    /**
     * @return Collection<int, Collection<int, Profile>>
     */
    public function buildCandidateGroups(Profile $profile): Collection
    {
        $similarProfiles = Profile::query()
            ->where('id', '!=', $profile->id)
            ->whereHas('embedding')
            ->orderByRaw(
                'profile_embeddings.embedding <-> (
                    SELECT embedding FROM profile_embeddings WHERE profile_id = ?
                )',
                [$profile->id]
            )
            ->limit(20)
            ->get();

        return $this->combineIntoGroups(
            collect([$profile])->merge($similarProfiles)
        );
    }

    /**
     * @return Collection<int, Collection<int, Profile>>
     */
    protected function combineIntoGroups(Collection $profiles): Collection
    {
        return $profiles
            ->chunk(4)
            ->filter(fn (Collection $group) => $group->count() >= 3)
            ->values();
    }

   
    public function suggestionAlreadyExists(Collection $profiles): bool
    {
        $ids = $profiles
            ->pluck('id')
            ->sort()
            ->values();

        return DB::table('band_suggestion_members')
            ->select('band_suggestion_id')
            ->groupBy('band_suggestion_id')
            ->havingRaw(
                'array_agg(profile_id ORDER BY profile_id) = ?',
                [$ids->toJson()]
            )
            ->exists();
    }

   
    public function scoreGroupWithAI(Collection $profiles): array
    {
        $payload = $profiles->map(fn (Profile $p) => [
            'instrument' => $p->instruments->pluck('name')->values(),
            'experience' => $p->experience_level,
            'genres'     => $p->genres->pluck('name')->values(),
            'objective'  => $p->objectives->pluck('name')->values(),
            'summary'    => $p->bio,
        ])->values();

        $response = app(OpenAIEmbeddingService::class)
            ->scoreBandCompatibility($payload->toArray());

        return [
            'score'  => $response['score'],
            'reason' => $response['reason'],
        ];
    }
}
