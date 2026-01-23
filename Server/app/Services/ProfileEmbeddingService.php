<?php

namespace App\Services;

use App\Models\Profile;
use App\Models\ProfileEmbedding;

class ProfileEmbeddingService
{
    public function processBatch(int $limit = 25): int
    {
        $profiles = Profile::query()
            ->where('embedding_dirty', true)
            ->with(['instruments', 'genres', 'objectives'])
            ->orderBy('updated_at')
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
        $text = app(ProfileEmbeddingTextBuilder::class)->build($profile);

        if ($text === '') {
            $profile->update(['embedding_dirty' => false]);
            return;
        }

            $embedding = app(OpenAIEmbeddingService::class)->generate($text);

            ProfileEmbedding::updateOrCreate(
                ['profile_id' => $profile->id],
                ['embedding' => $embedding]
            );

            $profile->update(['embedding_dirty' => false]);
          

}
}