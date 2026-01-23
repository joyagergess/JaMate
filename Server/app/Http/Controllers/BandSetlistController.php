<?php

namespace App\Http\Controllers;

use App\Models\Band;
use Illuminate\Http\Request;
use App\Services\BandSetlistService;

class BandSetlistController extends Controller
{
    public function __construct(
        protected BandSetlistService $service
    ) {}

    public function show(Band $band)
    {
        $data = $this->service->getForBand($band);

        return $this->successResponse(
            $data,
            'Band setlist status'
        );
    }

    public function generate(Request $request, Band $band)
    {
        logger()->info('GENERATE ENDPOINT HIT', [
            'band_id' => $band->id,
            'user_id' => $request->user()->id,
        ]);

        $profile = $request->user()->profile;

        abort_if(! $band->hasMember($profile), 403);

        $this->service->triggerGeneration($band);

        return $this->successResponse(
            ['status' => 'processing'],
            'Band setlist generation started'
        );
    }
}
