<?php

namespace App\Http\Controllers;

use App\Models\UserTrack;
use App\Services\TrackAiService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class TrackAiController extends Controller
{
    use ApiResponse;

    public function generateBacking(
        Request $request,
        UserTrack $track,
        TrackAiService $service
    ) {
        if ($track->profile_id !== $request->user()->profile->id) {
            return $this->errorResponse(
                'You are not allowed to generate a backing track for this track.',
                null,
                403
            );
        }

        $job = $service->startBackingGeneration($track);

        return $this->successResponse(
            [
                'job_id' => $job->id,
                'status' => $job->status,
            ],
            'AI backing track generation started.',
            202
        );
    }
}
