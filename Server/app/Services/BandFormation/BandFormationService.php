<?php

namespace App\Services\BandFormation;

use App\Models\Profile;

class BandFormationService
{
    public function __construct(
        protected BandSuggestionRepository $repo,
        protected BandGroupBuilder $builder
    ) {}

    public function generate(): void
    {
        $this->repo->purgeExpired();

        $profiles = $this->repo->eligibleProfiles();

        foreach ($profiles as $profile) {

            if ($this->repo->isInCooldown($profile)) {
                continue;
            }

            $slots = $this->repo->availableSlots($profile);
            if ($slots <= 0) {
                continue;
            }

            $groups = $this->builder
                ->forProfile($profile)
                ->take($slots);

            foreach ($groups as $group) {
                $this->repo->storeSuggestion($group);
            }
        }
    }
}
