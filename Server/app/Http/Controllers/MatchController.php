<?php

namespace App\Http\Controllers;

use App\Services\MatchService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class MatchController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected MatchService $matchService
    ) {}

    public function index(Request $request)
    {
        $profile = $request->user()->profile;

        if (! $profile) {
            return $this->errorResponse(
                'Profile not found',
                null,
                404
            );
        }

        try {
            $matches = $this->matchService->getMyMatches($profile);

            return $this->successResponse($matches);
        } catch (\Throwable $e) {
            return $this->errorResponse(
                'Failed to load matches',
                $e->getMessage(),
                500
            );
        }
    }
}
