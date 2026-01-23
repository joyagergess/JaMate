<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Internal\BandMembersProfilesRequest;
use App\Services\BandMembersProfilesService;
use App\Traits\ApiResponse;
use Throwable;

class BandMembersProfilesController extends Controller
{
    use ApiResponse;

    public function get(
        BandMembersProfilesRequest $request,
        BandMembersProfilesService $service
    ) {
        try {
            $data = $service->getProfiles(
                $request->integer('band_id')
            );

            return $this->successResponse(
                $data,
                'Band members profiles fetched successfully'
            );
        } catch (Throwable $e) {
            return $this->errorResponse(
                'Failed to fetch band members profiles',
                null,
                500
            );
        }
    }
}
