<?php

namespace App\Http\Controllers;

use App\Models\AiBackingJob;
use App\Services\AiBackingJobService;
use Illuminate\Http\Request;

class AiBackingJobController extends Controller
{

    public function __construct(
        private readonly AiBackingJobService $service
    ) {}

    public function show(Request $request, AiBackingJob $job)
    {
        return $this->successResponse(
            $this->service->showJob($request, $job),
            'AI backing job retrieved successfully'
        );
    }
}
