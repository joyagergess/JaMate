<?php

namespace App\Services;

use App\Models\Profile;

class ProfileEmbeddingTextBuilder
{
    public function build(Profile $profile): string
    {
        return trim(implode("\n", array_filter([
            $this->instruments($profile),
            $this->genres($profile),
            $this->objectives($profile),
            $this->experience($profile),
            $this->bio($profile),
            $this->location($profile),
        ])));
    }

    protected function instruments(Profile $profile): ?string
    {
        if ($profile->instruments->isEmpty()) {
            return null;
        }

        return 'Instruments: ' . $profile->instruments
            ->pluck('name')
            ->join(', ');
    }

    protected function genres(Profile $profile): ?string
    {
        if ($profile->genres->isEmpty()) {
            return null;
        }

        return 'Genres: ' . $profile->genres
            ->pluck('name')
            ->join(', ');
    }

    protected function objectives(Profile $profile): ?string
    {
        if ($profile->objectives->isEmpty()) {
            return null;
        }

        return 'Objectives: ' . $profile->objectives
            ->pluck('name')
            ->join(', ');
    }

    protected function experience(Profile $profile): ?string
    {
        return $profile->experience_level
            ? 'Experience level: ' . $profile->experience_level
            : null;
    }

    protected function bio(Profile $profile): ?string
    {
        return $profile->bio
            ? 'Bio: ' . $profile->bio
            : null;
    }

    protected function location(Profile $profile): ?string
    {
        return $profile->location
            ? 'Location: ' . $profile->location
            : null;
    }
}
