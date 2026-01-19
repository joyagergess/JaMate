<?php

namespace App\Services;

use App\Models\UserTrack;
use App\Models\AiBackingJob;
use App\Jobs\GenerateAiBackingJob;
use Illuminate\Validation\ValidationException;

class TrackAiService
{
    public function startBackingGeneration(
        UserTrack $track,
    ): AiBackingJob {
        if ($track->track_type === 'ai_generated') {
            throw ValidationException::withMessages([
                'track' => 'Cannot generate from AI-generated track.',
            ]);
        }

        $job = AiBackingJob::create([
            'source_track_id' => $track->id,
            'status' => 'queued',
        ]);

        GenerateAiBackingJob::dispatch($job);

        return $job;
    }
}
