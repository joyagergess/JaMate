<?php

namespace App\Http\Controllers;

use App\Http\Requests\Track\StoreTrackRequest;
use App\Models\UserTrack;
use App\Services\TrackService;
use App\Services\TrackUploadService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use App\Http\Requests\Track\UpdateTrackTitleRequest;

class TrackController extends Controller
{
    use ApiResponse;

    public function store(
        StoreTrackRequest $request,
        TrackService $trackService,
        TrackUploadService $trackUploadService
    ) {
        $profile = $request->user()->profile;

        $track = $trackService->store(
            profileId: $profile->id,
            audio: $request->file('audio'),
            duration: $request->integer('duration'),
            trackType: $request->string('track_type'),
            trackUploadService: $trackUploadService
        );

        return $this->successResponse(
            ['track' => $track],
            'Track created successfully.',
            201
        );
    }

    public function index(
        Request $request,
        TrackService $trackService
    ) {
        return $this->successResponse([
            'tracks' => $trackService->listTracks(
                $request->user()->profile->id
            ),
        ]);
    }


    public function updateTitle(
        UpdateTrackTitleRequest $request,
        UserTrack $track,
        TrackService $trackService
    ) {
        $updated = $trackService->updateTitle(
            track: $track,
            profileId: $request->user()->profile->id,
            title: $request->string('title')
        );

        return $this->successResponse(
            ['track' => $updated],
            'Track title updated successfully.'
        );
    }

    public function destroy(
        Request $request,
        UserTrack $track,
        TrackService $trackService
    ) {
        $trackService->deleteTrack(
            track: $track,
            profileId: $request->user()->profile->id
        );

        return $this->successResponse(
            null,
            'Track deleted successfully.'
        );
    }
}
