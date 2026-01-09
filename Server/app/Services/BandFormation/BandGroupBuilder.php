<?php

namespace App\Services\BandFormation;

use App\Models\Profile;
use Illuminate\Support\Collection;
use App\Services\SimilarityService;
class BandGroupBuilder
{
    private const GROUP_SIZE = 4;
    private const MAX_GROUPS = 4;
    private const MAX_CANDIDATES = 20;

    protected Profile $profile;

    public function forProfile(Profile $profile): Collection
    {
        $this->profile = $profile;

        $candidates = $this->findCandidates();

        if ($candidates->isEmpty()) {
            return collect();
        }

        return $this->buildGroups($candidates);
    }

    protected function findCandidates(): Collection
    {
        return Profile::query()
            ->where('id', '!=', $this->profile->id)
            ->whereHas('embedding')
            ->with(['embedding', 'instruments'])
            ->limit(50)
            ->get()
            ->sortByDesc(fn ($p) =>
                app(SimilarityService::class)->cosine(
                    $this->profile->embedding->embedding,
                    $p->embedding->embedding
                )
            )
            ->take(self::MAX_CANDIDATES)
            ->values();
    }

    protected function buildGroups(Collection $candidates): Collection
    {
        $groups = collect();
        $pool   = $candidates->shuffle();

        foreach ($pool as $candidate) {

            $group = collect([$this->profile, $candidate]);

            foreach ($pool as $extra) {
                if ($group->contains('id', $extra->id)) continue;

                $group->push($extra);
                if ($group->count() === self::GROUP_SIZE) break;
            }

            if ($group->count() === self::GROUP_SIZE && $this->hasDiversity($group)) {
                $groups->push($group);
            }

            if ($groups->count() >= self::MAX_GROUPS) break;
        }

        return $groups;
    }

    protected function hasDiversity(Collection $profiles): bool
    {
        return $profiles
            ->flatMap(fn ($p) => $p->instruments->pluck('name'))
            ->unique()
            ->count() > 1;
    }
}
