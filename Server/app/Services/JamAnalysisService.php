<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserTrack;
use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpKernel\Exception\HttpException;

class JamAnalysisService
{
    public function analyze(User $user, array $data): array
    {
        [$trackA, $trackB] = $this->resolveTracks(
            $user,
            $data['track_a_id'],
            $data['track_b_id']
        );

        return $this->callAiService($trackA, $trackB);
    }

    
    private function resolveTracks(
        User $user,
        int $trackAId,
        int $trackBId
    ): array {
        $trackA = UserTrack::findOrFail($trackAId);
        $trackB = UserTrack::findOrFail($trackBId);

        if (
            $trackA->profile_id !== $user->profile->id ||
            $trackB->profile_id !== $user->profile->id
        ) {
            throw new HttpException(
                403,
                'You do not own one or both tracks'
            );
        }

        return [$trackA, $trackB];
    }

   
    private function callAiService(
        UserTrack $trackA,
        UserTrack $trackB
    ): array {
        $response = Http::timeout(30)
            ->attach(
                'track_a',
                file_get_contents(
                    storage_path('app/public/' . $trackA->audio_url)
                ),
                basename($trackA->audio_url)
            )
            ->attach(
                'track_b',
                file_get_contents(
                    storage_path('app/public/' . $trackB->audio_url)
                ),
                basename($trackB->audio_url)
            )
            ->post(
                config('services.ai_music.url') . '/jam/analyze'
            );

        if (! $response->successful()) {
            throw new HttpException(
                502,
                'Jam analysis service unavailable'
            );
        }

        return $response->json();
    }
}
