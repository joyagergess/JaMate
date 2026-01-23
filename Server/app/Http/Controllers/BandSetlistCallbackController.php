<?php

namespace App\Http\Controllers;

use App\Http\Requests\Band\StoreBandSetlistCallbackRequest;
use App\Services\BandSetlistService;

class BandSetlistCallbackController extends Controller
{
    public function __construct(
        protected BandSetlistService $service
    ) {}

    public function store(StoreBandSetlistCallbackRequest $request)
    {
        $this->service->storeFromN8n(
            $request->integer('band_id'),
            $request->input('setlist')
        );

        return $this->successResponse(
            null,
            'Band setlist stored'
        );
    }
}
