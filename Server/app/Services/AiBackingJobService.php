<?php

namespace App\Services;

use App\Models\AiBackingJob;
use Illuminate\Http\Request;

class AiBackingJobService
{
    public function showJob(Request $request, AiBackingJob $job): array
    {
        if ($job->sourceTrack->profile_id !== $request->user()->profile->id) {
            abort(403);
        }

        if ($job->status !== 'done') {
            return [
                'status' => $job->status,
            ];
        }

        return [
            'status' => 'done',
            'track' => [
                'id' => $job->outputTrack->id,
                'audio_url' => $job->outputTrack->audio_public_url,
            ],
        ];
    }
}
