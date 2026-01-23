<?php

namespace App\Services;

use App\Models\UserTrack;
use App\Services\TrackUploadService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class TrackService
{
    public function store(
        int $profileId,
        UploadedFile $audio,
        int $duration,
        string $trackType,
        TrackUploadService $trackUploadService
    ): UserTrack {
        return $trackUploadService->uploadSnippet(
            profileId: $profileId,
            audio: $audio,
            duration: $duration,
            trackType: $trackType,
        );
    }

    public function updateTitle(
        UserTrack $track,
        int $profileId,
        string $title
    ): UserTrack {
        if ($track->profile_id !== $profileId) {
            throw new AuthorizationException();
        }

        $track->update(['title' => $title]);

        return $track->fresh()->append('audio_public_url');
    }

    public function deleteTrack(
        UserTrack $track,
        int $profileId
    ): void {
        if ($track->profile_id !== $profileId) {
            throw new AuthorizationException();
        }

        if ($track->audio_url) {
            Storage::disk('public')->delete($track->audio_url);
        }

        $track->delete();
    }

    public function listTracks(int $profileId)
    {
        return UserTrack::where('profile_id', $profileId)
            ->latest()
            ->get()
            ->map(function (UserTrack $track) {
                return [
                    'id' => $track->id,
                    'title' => $track->title,
                    'duration' => $track->duration,
                    'track_type' => $track->track_type,
                    'audio_public_url' => $track->audio_public_url,
                    'created_at' => $track->created_at?->toISOString(),
                    'ai_key' => $track->generatedByAiBackingJob?->musical_key,

                ];
            });
    }
}
