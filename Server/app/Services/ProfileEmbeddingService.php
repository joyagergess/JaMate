<?php

namespace App\Services;

use App\Models\Profile;
use App\Models\ProfileEmbedding;
use Illuminate\Support\Facades\DB;

class ProfileEmbeddingService
{
    public function upsert(Profile $profile): void
    {
        $profile->loadMissing(['instruments', 'genres', 'objectives']);

        $text = app(ProfileEmbeddingTextBuilder::class)->build($profile);

        if ($text === '') {
            return;
        }

        $embedding = app(OpenAIEmbeddingService::class)->generate($text);

        ProfileEmbedding::updateOrCreate(
            ['profile_id' => $profile->id],
            [
                'embedding' => $embedding,
                'updated_at' => now(),
            ]
        );
    }
}
