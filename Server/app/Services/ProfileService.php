<?php

namespace App\Services;

use App\Models\Profile;
use App\Models\ProfileMedia;
use App\Models\Instrument;
use App\Models\Genre;
use App\Models\Objective;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\HttpException;

class ProfileService
{
    public function create(User $user, array $data): Profile
    {
        if ($user->profile) {
            throw new HttpException(409, 'Profile already exists');
        }

        return DB::transaction(function () use ($user, $data) {

            $profile = $this->createProfile($user, $data);

            $this->syncInstruments($profile, $data['instruments']);
            $this->syncGenres($profile, $data['genres']);
            $this->syncObjectives($profile, $data['objectives']);
            $this->createMedia($profile, $data['media'] ?? []);

            return $profile->load([
                'instruments',
                'genres',
                'objectives',
            ]);
        });
    }

   
    private function createProfile(User $user, array $data): Profile
    {
        $profile = new Profile();
        $profile->user_id = $user->id;
        $profile->name = $data['name'];
        $profile->birth_date = $data['birth_date'];
        $profile->gender = strtolower($data['gender']);
        $profile->experience_level = strtolower($data['experience_level']);
        $profile->location = $data['location'] ?? null;
        $profile->bio = $data['bio'] ?? null;
        $profile->save();

        return $profile;
    }


    private function syncInstruments(Profile $profile, array $instruments): void
    {
        $ids = [];

        foreach ($instruments as $instrumentData) {
            $name = $this->normalizeName($instrumentData['name']);

            $instrument = Instrument::whereRaw(
                'LOWER(name) = ?',
                [strtolower($name)]
            )->first();

            if (!$instrument) {
                $instrument = new Instrument();
                $instrument->name = $name;
                $instrument->save();
            }

            $ids[] = $instrument->id;
        }

        $profile->instruments()->sync($ids);
    }

    private function syncGenres(Profile $profile, array $genres): void
    {
        $ids = [];

        foreach ($genres as $genreName) {
            $name = $this->normalizeName($genreName);

            $genre = Genre::whereRaw(
                'LOWER(name) = ?',
                [strtolower($name)]
            )->first();

            if (!$genre) {
                $genre = new Genre();
                $genre->name = $name;
                $genre->save();
            }

            $ids[] = $genre->id;
        }

        $profile->genres()->sync($ids);
    }

    private function syncObjectives(Profile $profile, array $objectives): void
    {
        $ids = [];

        foreach ($objectives as $objectiveName) {
            $name = $this->normalizeName($objectiveName);

            $objective = Objective::whereRaw(
                'LOWER(name) = ?',
                [strtolower($name)]
            )->first();

            if (!$objective) {
                $objective = new Objective();
                $objective->name = $name;
                $objective->save();
            }

            $ids[] = $objective->id;
        }

        $profile->objectives()->sync($ids);
    }

    private function createMedia(Profile $profile, array $media): void
    {
        foreach ($media as $item) {
            $profileMedia = new ProfileMedia();
            $profileMedia->profile_id = $profile->id;
            $profileMedia->media_type = $item['media_type'];
            $profileMedia->media_url = $item['media_url'];
            $profileMedia->order_index = $item['order_index'];
            $profileMedia->save();
        }
    }

    private function normalizeName(string $name): string
    {
        return ucfirst(strtolower(trim($name)));
    }

public function update(User $user, array $data): Profile
{
    $profile = $user->profile;

    if (!$profile) {
        throw new HttpException(404, 'Profile not found');
    }

    return DB::transaction(function () use ($profile, $data) {

        
        $profile->name = $data['name'];
        $profile->birth_date = $data['birth_date'];
        $profile->gender = strtolower($data['gender']);
        $profile->experience_level = strtolower($data['experience_level']);
        $profile->location = $data['location'] ?? null;
        $profile->bio = $data['bio'] ?? null;
        $profile->save();

   
        $this->syncInstruments($profile, $data['instruments']);
        $this->syncGenres($profile, $data['genres']);
        $this->syncObjectives($profile, $data['objectives']);

       
        $profile->media()->delete();
        $this->createMedia($profile, $data['media'] ?? []);

        return $profile->load([
            'instruments',
            'genres',
            'objectives',
            'media',
        ]);
    });
}
}