<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\BandSuggestionService;

class BandSuggestionController extends Controller
{
    public function __construct(
        protected BandSuggestionService $service
    ) {}

    public function index(Request $request)
    {
        $profile = $request->user()->profile;

        return $this->successResponse(
            $this->service->listForProfile($profile)
        );
    }

    public function accept(Request $request, int $suggestionId)
    {
        $profile = $request->user()->profile;

        $this->service->accept($suggestionId, $profile);

        return $this->successResponse(null, 'Band suggestion accepted');
    }

    public function reject(Request $request, int $suggestionId)
    {
        $profile = $request->user()->profile;

        $this->service->reject($suggestionId, $profile);

        return $this->successResponse(null, 'Band suggestion rejected');
    }
}
