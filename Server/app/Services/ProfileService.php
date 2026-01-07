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

            $this->syncByName(
                $profile,
                Instrument::class,
                'instruments',
                collect($data['instruments'])->pluck('name')->all()
            );

            $this->syncByName(
                $profile,
                Genre::class,
                'genres',
                $data['genres']
            );

            $this->syncByName(
                $profile,
                Objective::class,
                'objectives',
                $data['objectives']
            );

            $this->createMedia($profile, $data['media'] ?? []);

            return $profile->load([
                'instruments',
                'genres',
                'objectives',
                'media',
            ]);
        });
    }


    public function update(User $user, array $data): Profile
    {
        $profile = $user->profile;

        if (!$profile) {
            throw new HttpException(404, 'Profile not found');
        }

        return DB::transaction(function () use ($profile, $data) {

            $profile->update([
                'name'             => $data['name'],
                'birth_date'       => $data['birth_date'],
                'gender'           => strtolower($data['gender']),
                'experience_level' => strtolower($data['experience_level']),
                'location'         => $data['location'] ?? null,
                'bio'              => $data['bio'] ?? null,
            ]);

            $this->syncByName(
                $profile,
                Instrument::class,
                'instruments',
                collect($data['instruments'])->pluck('name')->all()
            );

            $this->syncByName($profile, Genre::class, 'genres', $data['genres']);
            $this->syncByName($profile, Objective::class, 'objectives', $data['objectives']);

            return $profile->load([
                'instruments',
                'genres',
                'objectives',
                'media',
            ]);
        });
    }



    private function createProfile(User $user, array $data): Profile
    {
        return Profile::create([
            'user_id'          => $user->id,
            'name'             => $data['name'],
            'birth_date'       => $data['birth_date'],
            'gender'           => strtolower($data['gender']),
            'experience_level' => strtolower($data['experience_level']),
            'location'         => $data['location'] ?? null,
            'bio'              => $data['bio'] ?? null,
        ]);
    }

    private function syncByName(Profile $profile, string $modelClass, string $relation, array $names): void
    {
        if (empty($names)) {
            $profile->{$relation}()->sync([]);
            return;
        }

        $normalized = collect($names)
            ->map(fn($n) => $this->normalizeName($n))
            ->unique()
            ->values();

        $existing = $modelClass::whereIn('name', $normalized)->get();

        $missing = $normalized->diff($existing->pluck('name'));

        if ($missing->isNotEmpty()) {
            $modelClass::insert(
                $missing->map(fn($name) => ['name' => $name])->all()
            );
        }

        $ids = $modelClass::whereIn('name', $normalized)->pluck('id')->all();
        $profile->{$relation}()->sync($ids);
    }

    private function createMedia(Profile $profile, array $media): void
    {
        if (empty($media)) {
            return;
        }

        ProfileMedia::insert(
            collect($media)->map(fn($item) => [
                'profile_id' => $profile->id,
                'media_type' => $item['media_type'],
                'media_url'  => $item['media_url'],
                'order_index' => $item['order_index'],
            ])->all()
        );
    }

    private function normalizeName(string $name): string
    {
        return ucfirst(strtolower(trim($name)));
    }


    public function get(User $user): Profile
    {
        $profile = $user->profile()
            ->with([
                'instruments',
                'genres',
                'objectives',
                'media',
            ])
            ->first();

        if (!$profile) {
            throw new HttpException(404, 'Profile not found');
        }

        return $profile;
    }
}
