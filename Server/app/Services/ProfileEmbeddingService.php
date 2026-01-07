<?php

namespace App\Services;

use App\Models\Profile;
use App\Models\ProfileEmbedding;

class ProfileEmbeddingService
{
    public function processBatch(int $limit = 10): int
    {
        $profiles = Profile::where('embedding_dirty', true)
            ->limit($limit)
            ->get();

        if ($profiles->isEmpty()) {
            return 0;
        }

        foreach ($profiles as $profile) {
            $this->processProfile($profile);
        }

        return $profiles->count();
    }

    private function processProfile(Profile $profile): void
    {
        $profile->loadMissing(['instruments', 'genres', 'objectives']);

        $text = app(ProfileEmbeddingTextBuilder::class)->build($profile);

        if ($text === '') {
            return;
        }

        $embedding = app(OpenAIEmbeddingService::class)->generate($text);

        ProfileEmbedding::updateOrCreate(
            ['profile_id' => $profile->id],
            ['embedding' => $embedding]
        );

        $profile->update([
            'embedding_dirty' => false,
        ]);
    }
}
