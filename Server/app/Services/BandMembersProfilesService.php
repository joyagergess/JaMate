<?php

namespace App\Services;

use App\Models\Band;

class BandMembersProfilesService
{
    public function getProfiles(int $bandId): array
    {
        $band = Band::with([
            'members.profile.genres',
            'members.profile.instruments',
            'members.profile.objectives',
        ])->findOrFail($bandId);

        return [
            'band_id' => $band->id,
            'members' => $band->members->map(function ($member) {
                $profile = $member->profile;

                return [
                    'profile_id' => $profile->id,
                    'name' => $profile->name,
                    'username' => $profile->username,
                    'bio' => $profile->bio,
                    'location' => $profile->location,
                    'experience_level' => $profile->experience_level,
                    'genres' => $profile->genres->pluck('name'),
                    'instruments' => $profile->instruments->pluck('name'),
                    'objectives' => $profile->objectives->pluck('name'),
                ];
            })->values(),
        ];
    }
}
