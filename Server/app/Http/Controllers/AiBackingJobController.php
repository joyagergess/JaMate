<?php

namespace App\Http\Controllers;

use App\Models\AiBackingJob;
use Illuminate\Http\Request;

class AiBackingJobController extends Controller
{
    public function show(Request $request, AiBackingJob $job)
    {
        if ($job->sourceTrack->profile_id !== $request->user()->profile->id) {
            abort(403);
        }

        if ($job->status !== 'done') {
            return response()->json([
                'status' => $job->status,
            ]);
        }

        return response()->json([
            'status' => 'done',
            'track' => [
                'id' => $job->outputTrack->id,
                'audio_url' => $job->outputTrack->audio_public_url,
            ],
        ]);
    }
}
