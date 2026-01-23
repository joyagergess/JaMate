<?php

namespace App\Http\Controllers;

use App\Http\Requests\Band\GenerateBandSetlistRequest;
use App\Services\BandSetlistProfileService;

class BandSetlistProfileController extends Controller
{
    public function __construct(
        protected BandSetlistProfileService $service
    ) {}

    public function generate(GenerateBandSetlistRequest $request)
    {
        $this->service->generateFromN8n(
            $request->integer('band_id')
        );

        return $this->successResponse(
            [
                'band_id' => $request->integer('band_id'),
                'status' => 'processing',
            ],
            'Band setlist generation triggered'
        );
    }
}
