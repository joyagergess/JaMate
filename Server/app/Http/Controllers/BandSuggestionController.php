<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\BandFormation\BandFormationService;
use App\Services\BandSuggestionService;

class BandSuggestionController extends Controller
{
    public function __construct(
        protected BandFormationService $formationService,
        protected BandSuggestionService $suggestionService
    ) {}


    public function generate()
    {
        $this->formationService->generate();

        return $this->successResponse(
            null,
            'Band suggestions generated successfully'
        );
    }



    public function index(Request $request)
    {
        return $this->successResponse(
            $this->suggestionService->listForProfile(
                $request->user()->profile
            )
        );
    }

    public function accept(Request $request, int $suggestionId)
    {
        $this->suggestionService->accept(
            $suggestionId,
            $request->user()->profile
        );

        return $this->successResponse(null, 'Band suggestion accepted');
    }

    public function reject(Request $request, int $suggestionId)
    {
        $this->suggestionService->reject(
            $suggestionId,
            $request->user()->profile
        );

        return $this->successResponse(null, 'Band suggestion rejected');
    }
}
