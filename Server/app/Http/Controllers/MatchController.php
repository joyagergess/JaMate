<?php

namespace App\Http\Controllers;

use App\Services\MatchService;
use Illuminate\Http\Request;

class MatchController extends Controller
{
    public function __construct(
        protected MatchService $matchService
    ) {}

    public function index(Request $request)
    {
        $profile = $request->user()->profile;

        if (! $profile) {
            return $this->errorResponse('Profile not found', 404);
        }

        $matches = $this->matchService->getMyMatches($profile);

        return $this->successResponse($matches);
    }
}
