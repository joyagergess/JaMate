<?php

namespace App\Services;

use App\Models\Profile;
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
            throw new HttpException(409, 'Profile already exists', null, [], 409);
        }

        return DB::transaction(function () use ($user, $data) {

            $profile = Profile::create([
                'user_id'          => $user->id,
                'name'             => $data['name'],
                'birth_date'       => $data['birth_date'],
                'gender'           => strtolower($data['gender']),
                'experience_level' => strtolower($data['experience_level']),
                'location'         => $data['location'] ?? null,
                'bio'              => $data['bio'] ?? null,
                'embedding_dirty'  => true,
            ]);

            $this->syncRelations($profile, $data);

            return $profile->load([
                'instruments',
                'genres',
                'objectives',
            ]);
        });
    }

    public function update(User $user, array $data): Profile
    {
        $profile = $user->profile;

        if (!$profile) {
            throw new HttpException(404, 'Profile not found', null, [], 404);
        }

        return DB::transaction(function () use ($profile, $data) {

            $embeddingDirty = $this->hasSemanticChanges($profile, $data);

            $profile->update([
                'name'             => $data['name'],
                'birth_date'       => $data['birth_date'],
                'gender'           => strtolower($data['gender']),
                'experience_level' => strtolower($data['experience_level']),
                'location'         => $data['location'] ?? null,
                'bio'              => $data['bio'] ?? null,
                'embedding_dirty'  => $embeddingDirty
                    ? true
                    : $profile->embedding_dirty,
            ]);

            $this->syncRelations($profile, $data);

            return $profile->load([
                'instruments',
                'genres',
                'objectives',
            ]);
        });
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

    private function syncRelations(Profile $profile, array $data): void
    {
        $this->syncByName(
            $profile,
            Instrument::class,
            'instruments',
            collect($data['instruments'])->pluck('name')->all()
        );

        $this->syncByName($profile, Genre::class, 'genres', $data['genres']);
        $this->syncByName($profile, Objective::class, 'objectives', $data['objectives']);
    }

    private function hasSemanticChanges(Profile $profile, array $data): bool
    {
        return
            $profile->bio !== ($data['bio'] ?? null) ||
            $profile->location !== ($data['location'] ?? null) ||
            $profile->experience_level !== strtolower($data['experience_level']) ||
            $this->relationChanged($profile, 'instruments', $data['instruments']) ||
            $this->relationChanged($profile, 'genres', $data['genres']) ||
            $this->relationChanged($profile, 'objectives', $data['objectives']);
    }

    private function relationChanged(Profile $profile, string $relation, array $incoming): bool
    {
        $current = $profile->$relation->pluck('name')->sort()->values()->toArray();
        $incoming = collect($incoming)->sort()->values()->toArray();

        return $current !== $incoming;
    }


    private function syncByName(Profile $profile, string $modelClass, string $relation, array $names): void
    {
        if (empty($names)) {
            $profile->{$relation}()->sync([]);
            return;
        }

        $normalized = collect($names)
            ->map(fn($n) => ucfirst(strtolower(trim($n))))
            ->unique()
            ->values();

        $existing = $modelClass::whereIn('name', $normalized)->pluck('id', 'name');
        $missing = $normalized->diff($existing->keys());

        if ($missing->isNotEmpty()) {
            $modelClass::insert(
                $missing->map(fn($name) => ['name' => $name])->all()
            );
        }

        $ids = $modelClass::whereIn('name', $normalized)->pluck('id')->all();
        $profile->{$relation}()->sync($ids);
    }

    
    public function show(Profile $profile): Profile
    {
        return $this->loadProfileRelations($profile);
    }
}
