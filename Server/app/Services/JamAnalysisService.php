<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use App\Models\User;
use App\Models\UserTrack;
use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpKernel\Exception\HttpException;

class JamAnalysisService
{
    public function analyze(User $user, array $data): array
    {
        [$trackA, $trackB] = $this->resolveTracks(
            $data['track_a_id'],
            $data['track_b_id']
        );

        return $this->callAiService($trackA, $trackB);
    }


    private function resolveTracks(
        int $trackAId,
        int $trackBId
    ): array {
        $trackA = UserTrack::findOrFail($trackAId);
        $trackB = UserTrack::findOrFail($trackBId);

        return [$trackA, $trackB];
    }


    private function callAiService(
        UserTrack $trackA,
        UserTrack $trackB
    ): array {
        $pathA = Storage::disk('public')->path($trackA->audio_url);
        $pathB = Storage::disk('public')->path($trackB->audio_url);

        if (! file_exists($pathA) || ! file_exists($pathB)) {
            throw new HttpException(500, 'Audio file missing on disk');
        }

        $response = Http::timeout(60)
            ->attach(
                'track_a',
                file_get_contents($pathA),
                basename($pathA)
            )
            ->attach(
                'track_b',
                file_get_contents($pathB),
                basename($pathB)
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
